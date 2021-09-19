const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: authorSchema,
    /* to make it required:
    author: {
      type: authorSchema,
      required: true,
    },
    */
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find()
    //.select("name")
    .populate("author", "name -_id")
    .populate("category", "name")
    .select("name author");
  console.log(courses);
}

async function updateAuthor(courseId) {
  /*
  const course = await Course.findById(courseId);
  course.author.name = "Robin Correa";
  course.save();
  */

  const course = await Course.updateOne(
    { _id: courseId },
    {
      $set: {
        "author.name": "John Smith",
      },
    }
  );

  // Unsetting
  /*
  const course = await Course.updateOne(
    { _id: courseId },
    {
      $unset: {
        author: "",
      },
    }
  );
  */
}

// createCourse("Node Course", new Author({ name: "Robin" }));
updateAuthor("6147555ff2afbf9cb87fe659");
//listCourses();
