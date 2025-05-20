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
            const promise = new Promise((resolve, reject) => {
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
                          Decision_With_Commends: item.Decision_With_Comments,
                        };

                        fileModel.createField(payload);
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

    getFiles: async (req, res) => {
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
                        const response = await fileModel.getFiles(payload);
                        responses.push(response);
                      } catch (error) { 
                         res.status(400).json({message:"No files matched!"})
                      }
                  }
          res.status(200).json({data:responses,message: "files fetched stuccessfully!" });
        } catch (error) {
          res.status(500).json({ message: "Internal server Error" }); 
        }
       
  },
    
    
    
    updateField: async(req,res) => {
         try {
    const fileBuffer = req.file.buffer;
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "Excel file is empty or invalid!" });
    }

    const results = [];

    for (const item of data) {
      const payload = { Title: item.Title,}
      if (!payload) continue;

      const records = await fileModel.updateFile(payload);

      if (records.length > 0) {
        const decisionMap = {};
        records.forEach(record => {
          decisionMap[record.Conference_Name] = record.Decision_With_Comments;
        });

        // Use the first record to populate common fields
        const first = records[0];

        results.push(records);
      }
    }

    res.status(200).json({
      message: "Grouped files fetched successfully",
      data: results
    });

  } catch (error) {
    console.error("Error processing Excel upload", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }}
}
module.exports = fileController;