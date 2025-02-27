import prisma from "@/utils/prisma";

const seed = async () => {
  await prisma.user.create({
    data: {
      email: "josephine.lacandula@rawmats.com",
      displayName: "Josephine Lacandula",
      Supplier: {
        create: {
          businessName: "KMJ Peanut Butter",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Peanuts",
                description: "Locally sourced peanuts",
                price: 100,
                // To be filled
                image:
                  "https://shewearsmanyhats.com/wp-content/uploads/2010/03/boiled-peanuts-recipe-2-320x240.jpg",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "erlinda.tuala@rawmats.com",
      displayName: "Erlinda Tuala",
      Supplier: {
        create: {
          businessName: "Lynda Food Products",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Banana",
                description: "Locally sourced bananas",
                price: 120,
                // To be filled
                image:
                  "https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bunch-of-bananas-67e91d5.jpg",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "macristina.tamon@rawmats.com",
      displayName: "Maria Cristina Tamon",
      Supplier: {
        create: {
          businessName: "Josh's Homemade Food Products",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Flour",
                description: "Locally sourced flour",
                price: 90,
                // To be filled
                image:
                  "https://your-ate-ph.com/cdn/shop/products/2ea96530-846a-413d-b25f-4837ba2e9253_425x.jpg?v=1588176745",
                verified: true,
              },
              {
                name: "Pineapple",
                description: "Locally sourced pineapple",
                price: 110,
                // To be filled
                image:
                  "https://images.immediate.co.uk/production/volatile/sites/30/2024/06/Pineapple-01-5562ee3.jpg?quality=90&resize=440,400",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "maricel.dacutan@rawmats.com",
      displayName: "Maricel Dacutan",
      Supplier: {
        create: {
          businessName: "RXL Peanut Butter",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Peanut",
                description: "Locally sourced peanuts",
                price: 100,
                // To be filled
                image:
                  "https://www.simplyrecipes.com/thmb/duGB5dcmcK-8lAtigoouQdvwX3U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Boiled-Peanuts-LEAD-09copy-2-0e40a61e6b404a05849475afd2811705.jpg",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "marilyn.calacasan@rawmats.com",
      displayName: "Marilyn Calacasan",
      Supplier: {
        create: {
          businessName: "Marilyn's Food Products",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Banana",
                description: "Locally sourced bananas",
                price: 120,
                // To be filled
                image:
                  "https://www.womansworld.com/wp-content/uploads/2024/07/Banana-Every-Day.jpg?w=1280&h=730&crop=1&quality=86&strip=all",
                verified: true,
              },
              {
                name: "Camote",
                description: "Locally sourced camote",
                price: 100,
                // To be filled
                image:
                  "https://upload.wikimedia.org/wikipedia/commons/5/58/Ipomoea_batatas_006.JPG",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "maryrose.mediodia@rawmats.com",
      displayName: "Mary Rose Mediodia",
      Supplier: {
        create: {
          businessName: "Mediodia's Delicacies",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Peanuts",
                description: "Locally sourced peanuts",
                price: 100,
                // To be filled
                image: "https://i.redd.it/uca6588x20w71.jpg",
                verified: true,
              },
              {
                name: "Banana",
                description: "Locally sourced banana",
                price: 100,
                // To be filled
                image:
                  "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_center,w_730,h_913/k%2Farchive%2Fc3a07ee741413dfe501f85a2ebca0da83f0c5f65",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "isidro.esconebra@rawmats.com",
      displayName: "Isidro Esconebra",
      Supplier: {
        create: {
          businessName: "Rose & Lourdes Special Bandi and Pasalubong",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Peanuts",
                description: "Locally sourced peanuts",
                price: 100,
                // To be filled
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpkvKwxaUsgMCSw5marxGQLbfj1weVcxD9IA&s",
                verified: true,
              },
              {
                name: "Banana",
                description: "Locally sourced banana",
                price: 100,
                // To be filled
                image:
                  "https://www.oecd.org/adobe/dynamicmedia/deliver/dm-aid--1d2d70ed-1160-434f-a0b5-fbfda73f912c/e762dec6-en-fr.jpg?preferwebp=true&quality=80",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "roqueta.praile@rawmats.com",
      displayName: "Roqueta Praile",
      Supplier: {
        create: {
          businessName: "Roquet's Food Products",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Banana",
                description: "Locally sourced banana",
                price: 100,
                // To be filled
                image:
                  "https://www.bhg.com/thmb/AGVRbt0F_ONAESXvIKB1vNi8aPs=/1866x0/filters:no_upscale():strip_icc()/What-Is-the-Manzano-Banana-b5f5e4e7b8784bdeb6322364ec3cfd1f.jpg",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "helen.tugublimas@rawmats.com",
      displayName: "Helen Tugublimas",
      Supplier: {
        create: {
          businessName: "Len's Peanut Products",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Peanuts",
                description: "Locally sourced peanuts",
                price: 100,
                // To be filled
                image:
                  "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1500,ar_3:2/k%2FPhoto%2FRecipes%2F2024-04-roasted-peanuts%2Froasted-peanuts-061",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "evelyn.ojerio@rawmats.com",
      displayName: "Evelyn Ojerio",
      Supplier: {
        create: {
          businessName: "Sachi's Food Products",
          businessLocation: "Iloilo",
          businessDocuments: [],
          verified: true,
          Product: {
            create: [
              {
                name: "Banana",
                description: "Locally sourced banana",
                price: 100,
                // To be filled
                image:
                  "https://cdn.shopify.com/s/files/1/0767/4655/files/IG-FEED-0814_grande.JPG?v=1580934189",
                verified: true,
              },
            ],
          },
        },
      },
    },
  });
};

const main = async () => {
  await seed();
  await prisma.$disconnect();
};

main();
