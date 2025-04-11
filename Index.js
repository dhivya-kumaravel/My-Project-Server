const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()


// middleware
app.use(cors());
app.use(express.json());

// username : jodhivne22
// PW : byzobI9rS6LSvr9F


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jodhivne22:byzobI9rS6LSvr9F@job-portal-mern.ts24r.mongodb.net/?retryWrites=true&w=majority&appName=JOB-PORTAL-MERN";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create db
       const db = client.db("jobPortalMERN");
       const jobsCollection = db.collection("mernjobs");

app.post("/login", async (req, res) => {
      const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
      db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if(err) return res.json("Login Failed");
        if(data.length > 0){
          return res.json("Login Successfully");
        }else{
          return res.json("No Record");
        }
      })
    })

    app.post('/signup', async (req, res) => {
      const {name, email, password} = req.body;
      const existingUser = await jobsCollection.findOne({email});
      if(existingUser){
        return res.status(400).send({message: "User already exists"});
      }else{
        const result = await jobsCollection.insertOne({name, email, password});
        res.status(201).send(result);
      }
    })

    //    post job
    app.post('/post-job', async (req, res) => {
        const body = req.body;
        body.createAt = new Date();
        // console.log(body);
   
    const result = await jobsCollection.insertOne(body);
         if(result.insertedId){
            return res.status(200).send(result);
         }else{
             return res.status(404).send({
                 message: "Can not insert try again later",
                 status: false
             })
         }
    })
   
       //    get all jobs
    app.get('/all-jobs', async (req, res) => {
        const jobs = await jobsCollection.find({}).toArray();
        res.send(jobs);
    })

    //get jobs by email

    app.get('/myJobs/:email', async (req, res) => {
      console.log(req.params.email);
        const jobs = await jobsCollection.find({postedBy: req.params.email}).toArray();
        res.send(jobs);
    })

    // delete

    app.delete("/job/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await jobsCollection.deleteOne(filter);
      res.send(result);
    }) 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
