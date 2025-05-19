const xlsx = require("xlsx")
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
                          .jsn({ message: "Error uploading on data" });
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

    getFiles: async(req,res) => {
        try {
            const response = await fileModel.getFiles();
            res.status(200).json({ data: response, message: "file fetched successfully" });
        } catch (error) {
            res.status(400).json({message:"Error occured while fetching file"})
        }
    },

    updateField: async(req,res) => {
        
    },

    

}
module.exports = fileController;