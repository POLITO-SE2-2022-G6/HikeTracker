import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user1 = {
        type: 'Hiker',
        email: 'prova@hiker.io',
        username: 'Utente Prova',
        phoneNumber : '3297898112',
        performance: {
          create: {
            duration: 100,
            altitude: 100.7
          },
        },
      }

      const user2 = {
        type: 'Hut Worker',
        email: 'butter@hutter.io',
        username: 'Peanut Butter',
        phoneNumber : '3297898321',
        performance: {
          create: {
            duration: 50,
            altitude: 12.7
          },
        },
      }


    const hike1 = {
        Title: 'Sentiero nei Boschi',
        Length: 30.2,
        Expected_time: 180,
        Ascent : 0.2,
        Difficulty: 'hard',
        Start_point: {
          create: {
            Label: 'hut',
            Latitude: 22.7,
            Longitude: 45.8,
            Elevation : 600
          },
        },
        End_point: {
            create: {
              Label: 'parking lot',
              Latitude: 44.7,
              Longitude: 40.4,
              Elevation : 600
            },
        },
        Reference_points: {
            create: [{
                Label: 'first important point',
                Latitude: 29.7,
                Longitude: 30.4,
                Elevation : 600
            },
            {
                Label: 'second important point',
                Latitude: 29.7,
                Longitude: 30.4,
                Elevation : 600
            },
        ]},
        Description: 'fun and interactive'


    }
   
     await prisma.user.create({ data: user1 })
     await prisma.user.create({ data: user2 })
     await prisma.hike.create({ data: hike1 })
   
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })