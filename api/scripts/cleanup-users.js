const { MongoClient } = require('mongodb');

async function cleanupUsers() {
    const client = new MongoClient('mongodb://127.0.0.1:27017/react_auth_course?retryWrites=true');

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('react_auth_course');
        const usersCollection = db.collection('users');

        // Count total users
        const totalUsers = await usersCollection.countDocuments();
        console.log(`Total users in database: ${totalUsers}`);

        // Find users with null or missing _id
        const problematicUsers = await usersCollection.find({
            $or: [
                { _id: null },
                { _id: { $exists: false } }
            ]
        }).toArray();

        console.log(`Found ${problematicUsers.length} users with problematic _id`);

        if (problematicUsers.length > 0) {
            console.log('Problematic users:');
            problematicUsers.forEach((user, index) => {
                console.log(`${index + 1}. Email: ${user.email}, _id: ${user._id}`);
            });

            // Ask for confirmation before deletion
            console.log('\n⚠️  These users will be deleted. This action cannot be undone!');
            console.log('To proceed, uncomment the deletion code below and run the script again.');

            // Uncomment the following lines to delete problematic users
            // console.log('Deleting problematic users...');
            // const deleteResult = await usersCollection.deleteMany({ 
            //   $or: [
            //     { _id: null },
            //     { _id: { $exists: false } }
            //   ]
            // });
            // console.log(`✅ Deleted ${deleteResult.deletedCount} problematic users`);
        }

        // Show users with duplicate emails
        const duplicateEmails = await usersCollection.aggregate([
            { $group: { _id: '$email', count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]).toArray();

        if (duplicateEmails.length > 0) {
            console.log(`\nFound ${duplicateEmails.length} duplicate email addresses:`);
            duplicateEmails.forEach(dup => {
                console.log(`- ${dup._id}: ${dup.count} occurrences`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

cleanupUsers();
