const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model(
    'Course',
    new mongoose.Schema({
        name: String,
        author: {
            type: authorSchema
        }
    })
);

async function createCourse(name, author) {
    const course = new Course({
        name,
        author: new Author({
            name: 'hbrehman',
            bio: 'Developer',
            website: 'dummyweb.com'
        })
    });

    const result = await course.save();
    console.log(result);
}

async function listCourses() {
    const courses = await Course.find();
    console.log(courses);
}

async function updateCourse(id) {
    let course = await Course.update(
        { _id: id },
        {
            $set: {
                'author.name': 'Muhammad Khalid',
                'author.bio': 'Frontend developer'
            }
        }
    );
    console.log(course);
}

createCourse('Node Course', new Author({ name: 'Mosh' }));

// listCourses();

updateCourse('5e2325d3eeb11f1fa8dd24c9');
