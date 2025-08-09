export const testCredentials = {
  validUser: {
    email: 'tafara@fixarwanda.com',
    password: '0784526338Mit2@'
  },

};

export const testUrls = {
  login: '/login',
  forgotPassword: '/forgot-password',
  dashboard: '/onboarding',
  employeeManagement: '/employees?page=1&perPage=10'
};

export const tradeFilterData = {
  electrician: 'Electrician',
  carpenter: 'Carpenter',
  helper: 'Helper',
  helper2: 'helper2',
  headman: 'Headman',
  aiDeveloper: 'ai developer'
};

export const employeeTestData = {
  expectedTrades: [
    'Electrician',
    'Carpenter', 
    'Helper',
    'helper2',
    'Headman',
    'ai developer'
  ],
  sampleEmployees: {
    electrician: {
      name: 'emmanuel agba-ogbonna',
      systemId: '66401',
      trade: 'Electrician',
      status: 'inactive'
    },
    carpenter: {
      name: 'daniel bizumuremyi',
      systemId: '64805',
      trade: 'Carpenter',
      status: 'inactive'
    }
  }
};