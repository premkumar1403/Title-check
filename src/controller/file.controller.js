const XLSX = require("xlsx")
const fileModel = require("../model/file.model")



const fileController = {
  
createFile: async (req, res) => {
        const file = req.file.buffer;

        try {
            const workbook = XLSX.read(file, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
            new Promise((resolve, reject) => {
                if (!data) {
                    reject();
                }
                else {
                    for (const item of data) {
                      try {
                        const payload = {
                          Title: item.Title,
                          Author_Mail: item.Author_Mail,
                          Conference_Name: item.Conference_Name,
                          Decision_With_Commends: item.Decision_With_Commends,
                        };

                        fileModel.createFiled(payload);
                        resolve();
                      } catch (error) {
                        res
                          .status(400)
                          .json({ message: "Error uploading on data" });
                      }
                    }
                }
            })
            
            res.status(201).json({
              message: "file uploaded to database successfully!",
            });
           
        } catch (error) {
            res.status(400).json({ message: "Error uploading files!" });
        }
    },

 getFile: async (req, res) => {
        const file = req.file.buffer;
        try {
            const workbook = XLSX.read(file, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
            
           
              if (!data || data.length === 0) {
                return new Error("response not found!");
          }
          const responses = [];
          for (const item of data) { 
                      try {
                          const payload = {
                              Title: item.Title,
                        }
                        const response = await fileModel.showFile(payload);
                        responses.push(response);
                      } catch (error) { 
                         res.status(400).json({message:"No files matched!"})
                      }
                  }

  
          let filteredData = [...responses];

        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((ex) => delete queryObj[ex]);

        filteredData = filteredData.filter(item => {
            return Object.entries(queryObj).every(([key, value]) =>
                item[key] && item[key].toString().toLowerCase() === value.toLowerCase()
            );
        });

        // Sorting
        if (req.query.sort) {
            const sortFields = req.query.sort.split(',').map(field => field.trim());
            filteredData.sort((a, b) => {
                for (let field of sortFields) {
                    let order = 1;
                    if (field.startsWith('-')) {
                        order = -1;
                        field = field.substring(1);
                    }
                    if (a[field] < b[field]) return -1 * order;
                    if (a[field] > b[field]) return 1 * order;
                }
                return 0;
            });
        }

        // Field selection
        let finalData = filteredData;
        if (req.query.fields) {
            const fields = req.query.fields.split(',');
            finalData = filteredData.map(item => {
                const newObj = {};
                fields.forEach(field => {
                    if (item[field]) newObj[field] = item[field];
                });
                return newObj;
            });
        }

        // Pagination
        const pageNum = parseInt(req.query.page) || 1;
        const limitNum = parseInt(req.query.limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const paginatedData = finalData.slice(skip, skip + limitNum);

        res.status(200).json({
            totalResults: filteredData.length,
            page: pageNum,
            limit: limitNum,
            data: paginatedData,
            message: "files fetched successfully!"
        });

    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ message: "Internal server Error" });
    }
       
  },  
    
    
    
    updateField: async(req,res) => {
         try {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

      if (!data || data.length === 0) {
        return res.status(400).json({ message: "Excel file is empty or invalid!" });
      }

      const responseList = [];

      for (const row of data) {
        const title = row.Title;
        const email = row.Email;

        if (!title || !email) continue;

        const record = await fileModel.updateFile(title);

        if (record) {
          const existingEmails = record.Author?.email || [];

          // If email does not exist, add it
          if (!existingEmails.includes(email)) {
            await fileModel.updateAuthorEmail(title, email);
          }

          // Prepare conference map
          const conferenceMap = {};
          for (const conf of record.Conference) {
            conferenceMap[conf.Conference_Name] = conf.Decision_With_Commends;
          }

          responseList.push({
            Title: record.Title,
            Author_Emails: record.Author.email,
            Conference_Decision_Map: conferenceMap
          });
        }
      }

      res.status(200).json({
        message: "Records processed successfully",
        data: responseList
      });

    } catch (error) {
      console.error("Error processing file:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = fileController;