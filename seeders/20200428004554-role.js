'use strict';

let roles = [
  {
    id: "9896079a-796d-4f20-8a9e-aedb437bfb60",
    role: "user"
  },
  {
    id: "9bb75588-96f3-4f87-9540-d84ce03f1755",
    role: "admin"
  },
  {
    id: "c30620f2-9f22-4f2d-918f-20b7862747be",
    role: "operator"
  },
  {
    id: "d5c6c8f5-07b0-4969-b4ff-c6fcd27440ec",
    role: "superAdmin"
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', roles, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
