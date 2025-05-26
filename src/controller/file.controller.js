const XLSX = require("xlsx");
const fileModel = require("../model/file.model");

const fileController = {
  createFile: async (req, res) => {
    function normalizeTitle(title){
      return title?.replace(/\s+/g, " ").trim().toLowerCase();
    }
    const file = req.file.buffer;

    try {
      const workbook = XLSX.read(file, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
      if (!data || data.length === 0) {
        return null;
      } else {
        const response = [];
        for (const item of data) {
          try {
            const payload = {
              Title: item.Title,
              Title: normalizeTitle(item.Title),
              Author_Mail: item.Author_Mail,
              Conference_Name: item.Conference_Name,
              Decision_With_Commends:
                item.Decision_With_Commends,
            };
            const responses = await fileModel.createField(payload);
            response.push(responses);
          } catch (error) {
            console.log("error uploading files!" + error);
          }
        }

        return res.status(201).json({
          data: response,
          message: "file uploaded to database successfully!",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error!" });
    }
  },

  getFile: async (req, res) => {
    try {
      const { q = "", page = 1, limit = 25 } = req.query;

      const searchTerm = q.trim().toLowerCase();
      const currentPage = parseInt(page);
      const itemsPerPage = parseInt(limit);

      const { results, totalCount } = await fileModel.getPaginatedFiles(
        searchTerm,
        currentPage,
        itemsPerPage
      );

      const totalPages = Math.ceil(totalCount / itemsPerPage);

      res.status(200).json({
        data: results,
        total_page: totalPages,
        message: "Files fetched successfully",
      });
    } catch (error) {
      console.error("Error in getFile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  searchTitle: async (req, res) => {
    const Title = req.query.Title.trim().toLowerCase();
    try {
      const response = await fileModel.searchTitle(Title);
      res.status(200).json({
        data: response,
        message: "Title matched files fetched successfully!",
      });
    } catch (error) {
      res.status(400).json({
        message:
          "user entered invalid title ensure the spelling and spaces carefully!",
      });
    }
  },
};
module.exports = fileController;
