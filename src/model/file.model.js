const mongoose = require("mongoose");


const fileschema = new mongoose.Schema({
  Title: { type: String },
    Author: [{
        Mail: { type: String},
    },],
  Conference: [{
    Conference_Name: { type: String},
    Decision_With_Commends:{type:String},
  },
});

const file = mongoose.model("Excel", fileschema);

const fileModel = {
    checkTitleExist: async (payload) => {
        const { Title, Author_Mail, Conference_Name, Decision_With_Commends } = payload;
        console.log(payload);
        
        const { Title,Author_Mail,Conference_Name,Decision_With_Commends} = payload;
        const exist = await file.find({Title});
        if (exist) {
           return exist;
            // return exist.Title, exist.Conference.Conference_Name, exist.Conference.Decision_With_Commends;
        }
        return await file.insertMany({ Title: Title, Author: {Mail:Author_Mail}, Conference: { Conference_Name:Conference_Name, Decision_With_Commends: Decision_With_Commends } });
        
        
    },

    createFiled: async(payload) => {        
        await fileModel.checkTitleExist(payload);
    },


    getFiles: async () => {
        try {
    const result = await file.find({});
    return result;
  } catch (error) {
    throw new Error("Error fetching files");
  }
        
    },
     
    updateFile: async (payload) => {
        const {Title} = payload;
        
        try {
      return await file.findOne({ Title: Title });
    } catch (error) {
      throw new Error("Error fetching by title");
    }
},

    updateAuthorEmail: async (Title, newEmail) => {
    try {
      return await file.updateOne(
        { Title: Title },
        { $addToSet: { "Author.email": newEmail } } // Avoid duplicates
      );
    } catch (error) {
      throw new Error("Error updating author email");
    }
  },
    showFile: async (payload) => {
        const { Title } = payload;
        try {
            const response = await file.find({ Title:Title });
            return response;
        } catch (error) {
            return new Error("erro validating title")
        }
        
    },

}

module.exports = fileModel;