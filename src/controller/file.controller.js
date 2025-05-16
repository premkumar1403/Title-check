const xlsx = require("xlsx")
const fileModel = require("../model/file.model")



const fileController = {
    createFile: async(req,res) => {
        const { Title, Author_Mail, Conference_Name, Decision_With_Comments } = req.body;
        try {
            const response_data=await fileModel.createFiled(Title, Author_Mail, Conference_Name, Decision_With_Comments);
            res.status(201).json({ data: response_data, message: "file uploaded to database successfully!" });
        } catch (error) {
            res.status(400).json({ message: "Error uploading files!" });
        }
    },

    updateField: async(req,res) => {
        
    },

    searchEmail: async(req,res) => {
        const { Author_Mail } = req.body;
        try {
            const response_data = await fileModel.searchEmail(Author_Mail);
            res.status(200).json({ data: response_data, message: "Details fetched for the given mailID" });
        } catch (error) {
            res.status(400).message("Error fetching Details!");
        }
    },

    searchTitle: async(req,res) => {
        const { Title } = req.body;
        try {
            const response_data = await fileModel.searchTitle(Title);
            res.status(200).json({ data: response_data, message: "Details fetched successfully!" });
        } catch (error) {
            res.status(400).message("Error fetching Details!");
        }
    },
    searchConference: async(req,res) => {
        const { Conference_Name } = req.body;
        try {
            const response_data = await fileModel.searchConference(Conference_Name);
            res.status(200).json({ data: response_data, message: "Details fetched successfully" });
        } catch (error) {
            res.stauts(400).json({ message: "Error fetching Details!" });
        }
    }
}
module.exports = fileController;