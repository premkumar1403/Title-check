// const XLSX = require("xlsx");
// const fileModel = require("../model/file.model");

// const fileController = {
//   createFile: async (req, res) => {
//     function normalizeTitle(title){
//       return title?.replace(/\s+/g, " ").trim().toLowerCase();
//     }
//     const file = req.file.buffer;

//     try {
//       const workbook = XLSX.read(file, { type: "buffer" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
//       if (!data || data.length === 0) {
//         return null;
//       } else {
//         const response = [];
//         for (const item of data) {
//           try {
//             const payload = {
//               Title: item.Title,
//               Title: normalizeTitle(item.Title),
//               Author_Mail: item.Author_Mail,
//               Conference_Name: item.Conference_Name,
//               Decision_With_Commends:
//                 item.Decision_With_Commends,
//             };
//             const responses = await fileModel.createField(payload);
//             response.push(responses);
//           } catch (error) {
//             console.log("error uploading files!" + error);
//           }
//         }

//         return res.status(201).json({
//           data: response,
//           message: "file uploaded to database successfully!",
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({ message: "Internal server error!" });
//     }
//   },

//   getFile: async (req, res) => {
//     try {
//       const { q = "", page = 1, limit = 25 } = req.query;

//       const searchTerm = q.trim().toLowerCase();
//       const currentPage = parseInt(page);
//       const itemsPerPage = parseInt(limit);

//       const { results, totalCount } = await fileModel.getPaginatedFiles(
//         searchTerm,
//         currentPage,
//         itemsPerPage
//       );

//       const totalPages = Math.ceil(totalCount / itemsPerPage);

//       res.status(200).json({
//         data: results,
//         total_page: totalPages,
//         message: "Files fetched successfully",
//       });
//     } catch (error) {
//       console.error("Error in getFile:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },

//   searchTitle: async (req, res) => {
//     const Title = req.query.Title.trim().toLowerCase();
//     try {
//       const response = await fileModel.searchTitle(Title);
//       res.status(200).json({
//         data: response,
//         message: "Title matched files fetched successfully!",
//       });
//     } catch (error) {
//       res.status(400).json({
//         message:
//           "user entered invalid title ensure the spelling and spaces carefully!",
//       });
//     }
//   },
// };
// module.exports = fileController;

const XLSX = require("xlsx");
const fileModel = require("../model/file.model");

const fileController = {
  // createFile: async (req, res) => {
  //   const fileBuffer = req.file.buffer;

  //   // Normalize helpers
  //   const normalizeTitle = (title) =>
  //     title?.replace(/\s+/g, " ").trim().toLowerCase();
  //   const normalizeEmail = (email) =>
  //     email?.replace(/\s+/g, "").trim().toLowerCase();

  //   try {
  //     const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

  //     if (!data || data.length === 0) {
  //       return res.status(400).json({ message: "No data found in sheet." });
  //     }

  //     const fileName = req.file.originalname.toLowerCase().trim();
  //     const isMaster = fileName.includes("2025 title check");

  //     // Process master file
  //     if (isMaster) {
  //       for (const item of data) {
  //         if (!item.Title || !item.Author_Mail || !item.Conference_Name)
  //           continue;

  //         await fileModel.createField({
  //           Title: normalizeTitle(item.Title),
  //           Author_Mail: normalizeEmail(item.Author_Mail),
  //           Conference_Name: item.Conference_Name,
  //           Decision_With_Commends: item.Decision_With_Commends || "",
  //         });
  //       }

  //       return res
  //         .status(200)
  //         .json({ message: "Master file uploaded successfully!" });
  //     }

  //     // Process individual conference file
  //     const matched = [];
  //     const newEntries = [];

  //     for (const item of data) {
  //       if (!item.Title || !item.Author_Mail || !item.Conference_Name) continue;

  //       const payload = {
  //         Title: normalizeTitle(item.Title),
  //         Author_Mail: normalizeEmail(item.Author_Mail),
  //         Conference_Name: item.Conference_Name,
  //         Decision_With_Commends: item.Decision_With_Commends || "",
  //       };

  //       const result = await fileModel.createField(payload); // returns inserted or updated
  //       // Use some logic to decide whether it's new or updated (can modify model to help)
  //       if (result.wasNew) {
  //         newEntries.push(result.data);
  //       } else {
  //         matched.push(result.data);
  //       }
  //     }

  //     return res.status(201).json({
  //       message: "Conference file uploaded successfully!",
  //       matched,
  //       newEntries,
  //     });
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     return res.status(500).json({ message: "Internal server error!" });
  //   }
  // },

  // createFile: async (req, res) => {
  //   function normalizeTitle(title) {
  //     return title?.replace(/\s+/g, " ").trim().toLowerCase();
  //   }

  //   const file = req.file?.buffer;
  //   const fileName = req.file?.originalname.toLowerCase();
  //   const isMaster = fileName.includes("2025 title check.xlsx");

  //   try {
  //     const workbook = XLSX.read(file, { type: "buffer" });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

  //     if (!data || data.length === 0) {
  //       return res.status(400).json({ message: "Empty Excel sheet." });
  //     }

  //     const uploadedEntries = [];

  //     for (const item of data) {
  //       try {
  //         const payload = {
  //           Title: normalizeTitle(item.Title),
  //           Author_Mail: item.Author_Mail,
  //           Conference_Name: item.Conference_Name,
  //           Decision_With_Commends: item.Decision_With_Commends,
  //         };

  //         const savedEntry = await fileModel.createField(payload);
  //         uploadedEntries.push(savedEntry);
  //       } catch (error) {
  //         console.error("Error saving entry:", error);
  //       }
  //     }

  //     // ✅ Console log only for conference sheets (not master)
  //     if (!isMaster) {
  //       console.log(
  //         "Uploaded Conference Sheet Processed Entries:\n",
  //         uploadedEntries
  //       );
  //     } else {
  //       console.log("Master file uploaded. No immediate response returned.");
  //     }

  //     return res.status(201).json({
  //       data: uploadedEntries,
  //       message: isMaster
  //         ? "Master sheet processed and updated successfully."
  //         : "Conference sheet uploaded and matched/updated successfully.",
  //     });
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // },

  createFile: async (req, res) => {
    function normalizeTitle(title) {
      return title?.replace(/\s+/g, " ").trim().toLowerCase();
    }

    const file = req.file?.buffer;
    const fileName = req.file?.originalname.toLowerCase();
    const isMaster = fileName.includes("2025 title check.xlsx");

    try {
      const workbook = XLSX.read(file, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

      if (!data || data.length === 0) {
        return res.status(400).json({ message: "Empty Excel sheet." });
      }

      if (isMaster) {
        // Process normally and return a success message
        for (const item of data) {
          const payload = {
            Title: normalizeTitle(item.Title),
            Author_Mail: item.Author_Mail,
            Conference_Name: item.Conference_Name,
            Decision_With_Commends: item.Decision_With_Commends,
          };
          await fileModel.createField(payload);
        }

        return res.status(201).json({
          message: "Master sheet uploaded successfully.",
        });
      } else {
        const matchedEntries = [];

        for (const item of data) {
          const normalizedTitle = normalizeTitle(item.Title);
          const authorEmail = item.Author_Mail;
          const currentConf = item.Conference_Name;

          // Find document with same title and author
          const match = await fileModel.findByTitleAndAuthor(
            normalizedTitle,
            authorEmail
          );

          if (match) {
            const otherConfs = match.Conference.filter(
              (conf) => conf.Conference_Name !== currentConf
            );

            if (otherConfs.length > 0) {
              matchedEntries.push({
                Title: match.Title,
                Author_Mail: match.Author_Mail,
                Other_Conferences: otherConfs,
              });
            }
          }

          // Save/update as usual
          const payload = {
            Title: normalizedTitle,
            Author_Mail: authorEmail,
            Conference_Name: currentConf,
            Decision_With_Commends: item.Decision_With_Commends,
          };
          await fileModel.createField(payload);
        }

        // Return only matched records
        console.log(
          "Matched entries from other conferences:\n",
          matchedEntries
        );

        return res.status(201).json({
          data: matchedEntries,
          message:
            "Uploaded and matched entries from other conferences fetched.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "Internal server error" });
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
          "User entered invalid title. Ensure the spelling and spaces are correct.",
      });
    }
  },
};

module.exports = fileController;
