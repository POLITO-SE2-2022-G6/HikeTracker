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

const hikers: Prisma.UserCreateInput[] = Array(5).fill(0).map(e => {
  return {
    type: 'hiker',
    username: faker.internet.userName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
  }
})

const guides: Prisma.UserCreateInput[] = Array(5).fill(0).map(e => {
  return {
    type: 'guide',
    username: faker.internet.userName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    verified: true
  }
})

const hikes: Prisma.HikeCreateInput[] = Array(20).fill(0).map(e => {
  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    ascent: Math.floor(Math.random() * 1000) - 500,
    difficulty: Math.floor(Math.random() * 5),
    length: Math.floor(Math.random() * 10000),
    expected_time: Math.floor(Math.random() * 500),
    localguide: {
      connect: {
        id: Math.floor(hikers.length + Math.random() * guides.length)
      }
    },
    start_point: {
      create: {
        city: faker.address.city(),
        region: regioni[Math.floor(Math.random() * regioni.length)],
        province: province[Math.floor(Math.random() * province.length)],
        latitude: parseFloat(faker.address.latitude(47.1153931748, 36.619987291)),
        longitude: parseFloat(faker.address.longitude(18.4802470232, 6.7499552751)),
        hut: {
          create: {
            description: faker.lorem.paragraph(),
          }
        }
      }
    },
    end_point: {
      create: {
        city: faker.address.city(),
        region: regioni[Math.floor(Math.random() * regioni.length)],
        province: province[Math.floor(Math.random() * province.length)],
        latitude: parseFloat(faker.address.latitude(47.1153931748, 36.619987291)),
        longitude: parseFloat(faker.address.longitude(18.4802470232, 6.7499552751)),
        parkinglot: {
          create: {
            description: faker.lorem.paragraph(),
          }
        }
      }
    },

  }
})

const huts: Prisma.HutCreateInput[] = Array(100).fill(0).map(e => {
  return {
    description: faker.lorem.paragraph(),
    point: {
      create: {
        city: faker.address.city(),
        region: regioni[Math.floor(Math.random() * regioni.length)],
        province: province[Math.floor(Math.random() * province.length)],
        label: faker.address.streetName(),
        latitude: parseFloat(faker.address.latitude(47.1153931748, 36.619987291)),
        longitude: parseFloat(faker.address.longitude(18.4802470232, 6.7499552751)),
      }
    }
  }
})

const parkings: Prisma.ParkingLotCreateInput[] = Array(100).fill(0).map(e => {
  return {
    description: faker.lorem.paragraph(),
    point: {
      create: {
        city: faker.address.city(),
        region: regioni[Math.floor(Math.random() * regioni.length)],
        province: province[Math.floor(Math.random() * province.length)],
        label: faker.address.streetName(),
        latitude: parseFloat(faker.address.latitude(47.1153931748, 36.619987291)),
        longitude: parseFloat(faker.address.longitude(18.4802470232, 6.7499552751)),
      }
    }
  }
})

const usrs =[
  {
    email: "guide@email.com", 
    type: 'guide',
    username: faker.internet.userName(),
    phoneNumber: faker.phone.number(),
    verified: true
  },
  {
    email: "hiker@email.com",
    type: "hiker",
    username: faker.internet.userName(),
    phoneNumber: faker.phone.number()
  },
  {
    email: "hworker@email.com",
    type: "hworker",
    username: faker.internet.userName(),
    phoneNumber: faker.phone.number(),
    verified: true,
    hutid: 1
  },
  {
    email: "manager@email.com",
    type: "manager",
    username: faker.internet.userName(),
    phoneNumber: faker.phone.number()
  }
]


const performance = {
  hikerid: 11,
  difficulty: 3
}

const usrsPromises = usrs.map(u => prisma.user.create({data: u}));
const guidesPromises = guides.map(u => prisma.user.create({ data: u }))
const hikersPromises = hikers.map(u => prisma.user.create({ data: u }))

const hutsPromises = huts.map(h => prisma.hut.create({ data: h }))
const parkingsPromises = parkings.map(p => prisma.parkingLot.create({ data: p }))
const performancePromises = prisma.performance.create({ data: performance })


Promise.all(hikersPromises)
  .then(() => Promise.all(guidesPromises))
  .then((gl) => Promise.all(
    hikes.map(h => prisma.hike.create({
      data: {
        ...h,
        localguide: {
          connect: {
            id: gl[Math.floor(Math.random() * gl.length)].id
          }
        }
      }
    }))
  ))
  .then(() => Promise.all(hutsPromises))
  .then(() => Promise.all(parkingsPromises))
  .then(() => Promise.all(usrsPromises))
  .then(() => Promise.resolve(performancePromises))
  .then(() => {
    console.log('Seed finished')
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  }
  )
