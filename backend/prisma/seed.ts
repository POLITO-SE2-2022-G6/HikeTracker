import { PrismaClient, Prisma } from '@prisma/client'
import { faker } from "@faker-js/faker/locale/it"
const prisma = new PrismaClient()

const regioni = [
  "Abruzzo",
  "Basilicata",
  "Calabria",
  "Campania",
  "Emilia-Romagna",
  "Friuli-Venezia Giulia",
  "Lazio",
  "Liguria",
  "Lombardia",
  "Marche",
  "Molise",
  "Piemonte",
  "Puglia",
  "Sardegna",
  "Sicilia",
  "Toscana",
  "Trentino-Alto Adige",
  "Umbria",
  "Valle d'Aosta",
  "Veneto"
]

const province = ["Agrigento", "Alessandria", "Ancona", "Arezzo", "AscoliPiceno", "Asti", "Avellino", "Bari", "Barletta-Andria-Trani", "Belluno", "Benevento", "Bergamo", "Biella", "Bologna", "Bolzano", "Brescia", "Brindisi", "Cagliari", "Caltanissetta", "Campobasso", "Caserta", "Catania", "Catanzaro", "Chieti", "Como", "Cosenza", "Cremona", "Crotone", "Cuneo", "Enna", "Fermo", "Ferrara", "Firenze", "Foggia", "Forlì-Cesena", "Frosinone", "Genova", "Gorizia", "Grosseto", "Imperia", "Isernia", "L'Aquila", "LaSpezia", "Latina", "Lecce", "Lecco", "Livorno", "Lodi", "Lucca", "Macerata", "Mantova", "Massa-Carrara", "Matera", "Messina", "Milano", "Modena", "MonzaedellaBrianza", "Napoli", "Novara", "Nuoro", "Oristano", "Padova", "Palermo", "Parma", "Pavia", "Perugia", "PesaroeUrbino", "Pescara", "Piacenza", "Pisa", "Pistoia", "Pordenone", "Potenza", "Prato", "Ragusa", "Ravenna", "ReggioCalabria", "Reggionell'Emilia", "Rieti", "Rimini", "Roma", "Rovigo", "Salerno", "Sassari", "Savona", "Siena", "Siracusa", "Sondrio", "SudSardegna", "Taranto", "Teramo", "Terni", "Torino", "Trapani", "Trento", "Treviso", "Trieste", "Udine", "Valled'Aosta", "Varese", "Venezia", "Verbano-Cusio-Ossola", "Vercelli", "Verona", "ViboValentia", "Vicenza", "Viterbo"]

const hikers: Prisma.UserCreateInput[] = Array(10).fill(0).map(e => {
  return {
    type: 'hiker',
    username: faker.internet.userName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
  }
})

const guides: Prisma.UserCreateInput[] = Array(10).fill(0).map(e => {
  return {
    type: 'guide',
    username: faker.internet.userName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
  }
})

const hikes: Prisma.HikeCreateInput[] = Array(20).fill(0).map(e => {
  return {
    Title: faker.commerce.productName(),
    Description: faker.lorem.paragraph(),
    Ascent: Math.floor(Math.random() * 1000) - 500,
    Difficulty: Math.floor(Math.random() * 5),
    Length: Math.floor(Math.random() * 10000),
    Expected_time: Math.floor(Math.random() * 500),
    LocalGuide: {
      connect: {
        id: Math.floor(hikers.length + Math.random() * guides.length)
      }
    },
    Start_point: {
      create: {
        City: faker.address.city(),
        Region: regioni[Math.floor(Math.random() * regioni.length)],
        Province: province[Math.floor(Math.random() * province.length)],
        Latitude: parseFloat(faker.address.latitude(18.4802470232, 6.7499552751)),
        Longitude: parseFloat(faker.address.longitude(47.1153931748, 36.619987291)),
        Hut: {
          create: {
            Description: faker.lorem.paragraph(),
          }
        }
      }
    },
    End_point: {
      create: {
        City: faker.address.city(),
        Region: regioni[Math.floor(Math.random() * regioni.length)],
        Province: province[Math.floor(Math.random() * province.length)],
        Latitude: parseFloat(faker.address.latitude(18.4802470232, 6.7499552751)),
        Longitude: parseFloat(faker.address.longitude(47.1153931748, 36.619987291)),
        ParkingLot: {
          create: {
            Description: faker.lorem.paragraph(),
          }
        }
      }
    },

  }
})

const huts: Prisma.HutCreateInput[] = Array(100).fill(0).map(e => {
  return {
    Description: faker.lorem.paragraph(),
    Point: {
      create: {
        City: faker.address.city(),
        Region: regioni[Math.floor(Math.random() * regioni.length)],
        Province: province[Math.floor(Math.random() * province.length)],
        Label: faker.address.streetName(),
        Latitude: parseFloat(faker.address.latitude(18.4802470232, 6.7499552751)),
        Longitude: parseFloat(faker.address.longitude(47.1153931748, 36.619987291)),
      }
    }
  }
})

const parkings: Prisma.ParkingLotCreateInput[] = Array(100).fill(0).map(e => {
  return {
    Description: faker.lorem.paragraph(),
    Point: {
      create: {
        City: faker.address.city(),
        Region: regioni[Math.floor(Math.random() * regioni.length)],
        Province: province[Math.floor(Math.random() * province.length)],
        Label: faker.address.streetName(),
        Latitude: parseFloat(faker.address.latitude(47.1153931748, 36.619987291)),
        Longitude: parseFloat(faker.address.longitude(18.4802470232, 6.7499552751)),
      }
    }
  }
})



const guidesPromises = guides.map(u => prisma.user.create({ data: u }))
const hikersPromises = hikers.map(u => prisma.user.create({ data: u }))

const hutsPromises = huts.map(h => prisma.hut.create({ data: h }))
const parkingsPromises = parkings.map(p => prisma.parkingLot.create({ data: p }))

Promise.all(hikers)
  .then(() => Promise.all(guidesPromises))
  .then((gl) => Promise.all(
    hikes.map(h => prisma.hike.create({
      data: {
        ...h,
        LocalGuide: {
          connect: {
            id: gl[Math.floor(Math.random() * gl.length)].id
          }
        }
      }
    }))
  ))
  .then(() => Promise.all(hutsPromises))
  .then(() => Promise.all(parkingsPromises))
  .then(() => {
    console.log('Seed finished')
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  }
  )
