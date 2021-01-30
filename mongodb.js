//CRUD Operation
const mongoDB = require("mongodb");
const MongoClient = mongoDB.MongoClient;
const ObjectID = mongoDB.ObjectID;

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

const id = new ObjectID();

console.log(id);

console.log(id.getTimestamp());

MongoClient.connect(
  connectionUrl,
  {
    useNewUrlParser: true,
  },
  (err, client) => {
    if (err) {
      return console.log({ err });
    }

    const db = client.db(databaseName);

    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectID("6005a339dd89442a08cb9884"),
    //     },
    //     {
    //       $set: {
    //         name: "Mike",
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    db.collection("tasks")
      .updateMany(
        {
          completed: false,
        },
        {
          $set: {
            completed: true,
          },
        }
      )
      .then((res) => {
        console.log(res.modifiedCount);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
