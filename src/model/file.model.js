const mongoose = require("mongoose");


const fileschema = new mongoose.Schema({
    Title: { type: String, required: true },
    Author_Mail: { type: String, required: true ,unique:true},
    Conference_Name: { type: String, required: true },
    Decision_With_Comments: { type: String, required: true }
});

const file = mongoose.model("Excel", fileschema);

const fileModel = {
    checkTitleExist: async (payload) => {
        const { Title,Author_Mail,Conference_Name,Decision_With_Comments} = payload;
        const exist = await file.findOne(Title);
        if (exist) {
            return exist.Title, exist.Conference_Name, exist.Decision_With_Comments;
        }
        else {
            return await file.insertMany(Title, Author_Mail, Conference_Name, Decision_With_Comments);
        }
    },

    createFiled: async(payload) => {
        await fileModel.checkTitleExist(payload);
    },
     
    updateField: async ({ Title, Author_Mail, Conference_Name, Decision_With_Comments }) => {
        try {
        const updated = await file.findOneAndUpdate(
        { Title },
        {
        Author_Mail,
        Conference_Name,
        Decision_With_Comments
        },
        { new: true} // upsert creates the document if it doesn't exist
        );
        return updated;
        } catch (error) {
        console.error("Error updating the document:", error);
        throw error;
        }
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