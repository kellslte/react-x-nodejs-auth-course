const { MongoClient } = require('mongodb');

async function fixDatabaseIndexes() {
    const client = new MongoClient('mongodb://127.0.0.1:27017/react_auth_course?retryWrites=true');

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('react_auth_course');
        const usersCollection = db.collection('users');

        // List all indexes
        console.log('Current indexes:');
        const indexes = await usersCollection.indexes();
        indexes.forEach(index => {
            console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
        });

        // Check for problematic 'id' index
        const problematicIndex = indexes.find(index => index.name === 'id_1');
        if (problematicIndex) {
            console.log('\nFound problematic index "id_1", attempting to drop it...');
            try {
                await usersCollection.dropIndex('id_1');
                console.log('✅ Successfully dropped id_1 index');
            } catch (error) {
                console.log('❌ Failed to drop id_1 index:', error.message);
            }
        }

        // Ensure email index exists
        console.log('\nEnsuring email index exists...');
        try {
            await usersCollection.createIndex({ email: 1 }, { unique: true, name: 'email_1' });
            console.log('✅ Email index created/verified');
        } catch (error) {
            console.log('❌ Failed to create email index:', error.message);
        }

        // List indexes again
        console.log('\nUpdated indexes:');
        const updatedIndexes = await usersCollection.indexes();
        updatedIndexes.forEach(index => {
            console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

fixDatabaseIndexes();
