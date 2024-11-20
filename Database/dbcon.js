const {MongoClient} = require('mongodb');

async function main() {
    const url = "mongodb://localhost:27017";

    const client = new MongoClient(url);

    try {
        await client.connect();

        // await listDatabases(client);
        const user = {
            username:'Lastrategie',
            num_msg: 0,
            tel: 237671624397,
            dob: '07-08-2003'
        };
        await adduser(client,user);
    } catch (e) {
        console.log(e);
    } finally{
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    const listDatabasesList = await client.db().admin().listDatabases();
    console.log("Databases: ")
    listDatabasesList.databases.forEach(db => {
        console.log(` - ${db.name}`);
    });
}

async function adduser(client, user){
    const result = await client.db('whatsapp').collection("user").insertOne(user);
    console.log(`New user inserted with following id ${result.insertedId}`);
}

