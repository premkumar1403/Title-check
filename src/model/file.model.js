const mongoose = require("mongoose");

const fileschema = new mongoose.Schema({
  Title: { type: String },
  Author_Mail: [{ Author_Mail: { type: String } }],
  Conference: [
    {
      Conference_Name: { type: String },
      Decision_With_Commends: { type: String },
    },
  ],
});

const file = mongoose.model("Excel", fileschema);

const fileModel = {

  //Function checks title is exist or not
  checkTitleExist: async (payload) => {
    const { Title, Author_Mail, Conference_Name, Decision_With_Commends } =
      payload;
    let savedFile = null;
    const existingFile = await file.findOne({ Title });

    if (existingFile) {
      const authorExists = existingFile.Author_Mail.some(
        (author) => author.Author_Mail === Author_Mail
      );

      if (authorExists) {
        const conferenceIndex = existingFile.Conference.findIndex(
          (conf) => conf.Conference_Name === Conference_Name
        );

        if (conferenceIndex !== -1) {
          if (Decision_With_Commends && Decision_With_Commends.trim() !== "") {
            existingFile.Conference[conferenceIndex].Decision_With_Commends =
              Decision_With_Commends;
          } else {
            console.log("Empty decision — keeping old value");
          }
        } else {
          existingFile.Conference.push({
            Conference_Name,
            Decision_With_Commends,
          });
        }
      } else {
        existingFile.Author_Mail.push({ Author_Mail });

        const conferenceIndex = existingFile.Conference.findIndex(
          (conf) => conf.Conference_Name === Conference_Name
        );

        if (conferenceIndex !== -1) {
          if (Decision_With_Commends && Decision_With_Commends.trim() !== "") {
            existingFile.Conference[conferenceIndex].Decision_With_Commends =
              Decision_With_Commends;
          } else {
            console.log("Empty decision — keeping old value");
          }
        } else {
          existingFile.Conference.push({
            Conference_Name,
            Decision_With_Commends,
          });
        }
      }

      savedFile = await existingFile.save(); //saves as a file
    } else {
      const [newfile] = await file.create([
        {
          Title,
          Author_Mail: [{ Author_Mail }],
          Conference: [
            {
              Conference_Name,
              Decision_With_Commends,
            },
          ],
        },
      ]);
      savedFile = newfile;
    }
    return savedFile;
  },

  //Record cration function
  createField: async (payload) => {
    return await fileModel.checkTitleExist(payload);
  },

  getFile: async () => {
      return await file.find();
  }
};

module.exports = fileModel;
