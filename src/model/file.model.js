const mongoose = require("mongoose");


const fileschema = new mongoose.Schema({
    Title: { type: String, required: true },
    Author_Mail: { type: String, required: true},
    Conference_Name: { type: String, required: true },
    Decision_With_Comments: { type: String, required: true }
});

const file = mongoose.model("Excel", fileschema); 

const fileModel = {
    checkTitleExist: async (payload) => { 
        console.log(payload);
        
        const { Title,Author_Mail,Conference_Name,Decision_With_Commends} = payload;
        const exist = await file.findOne({Title});
        if (exist) {
            return exist;
        }
        else {
            return await file.insertMany({ Title:Title, Author_Mail:Author_Mail, Conference_Name:Conference_Name, Decision_With_Comments:Decision_With_Commends });
        }
    },

    createField: async(payload) => {
        await fileModel.checkTitleExist(payload);
    },


    getFiles: async() => {
        await file.find();
    },
     
    updateField: () => {
        
    },

    searchEmail: async (Author_Mail) => {
        try {
            const response = await file.findOne(Author_Mail);
            return response;
        } catch (error) {
            return new Error("Error occured!");
        }
        
    },

    searchTitle: async (Title) => {
        try {
            const response = await file.findOne(Title);
            return response;
        } catch (error) {
            return new Error("Error occured!");
        }
      
    },

    searchConference: async (Conference_Name) => {
        try {
            const response = await file.findOne(Conference_Name);
            return response;
        } catch (error) {
            return new Error("Error occured!");
        }
    }

}

module.exports = fileModel;