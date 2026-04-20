export interface Resource {
  id: string;
  title: string;
  category: string;
  class: string;
  link: string;
  type: 'textbook' | 'paper' | 'guide';
}

export const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Mathematics (Class 9-10)',
    category: 'Science',
    class: '9-10',
    link: 'http://www.nctb.gov.bd/site/page/f403980a-9d2a-4db5-baa8-a37f5979c178/%E0%A6%A8%E0%A6%AC%E0%A6%AE-%E0%A6%A6%E0%A6%B6%E0%A6%AE-%E0%A6%B6%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%A3%E0%A6%BF',
    type: 'textbook'
  },
  {
    id: '2',
    title: 'Physics (Class 9-10)',
    category: 'Science',
    class: '9-10',
    link: 'http://www.nctb.gov.bd/site/page/f403980a-9d2a-4db5-baa8-a37f5979c178',
    type: 'textbook'
  },
  {
    id: '3',
    title: 'SSC Past Papers - 2023',
    category: 'Exam Papers',
    class: 'SSC',
    link: 'https://dhakaeducationboard.gov.bd/',
    type: 'paper'
  },
  {
    id: '4',
    title: 'English For Today (Class 11-12)',
    category: 'Language',
    class: '11-12',
    link: 'http://www.nctb.gov.bd/site/page/87e7f781-a67b-400c-8d19-4cd8f8303f8e/%E0%A6%89%E0%A6%9A%E0%A7%8D%E0%A6%9A-%E0%A6%AE%E0%A6%BE%E0%A6%A7%E0%A7%8D%E0%A6%AF%E0%A6%AE%E0%A6%BF%E0%A6%95',
    type: 'textbook'
  },
  {
    id: '5',
    title: 'HSC Past Papers - 2022',
    category: 'Exam Papers',
    class: 'HSC',
    link: 'https://dhakaeducationboard.gov.bd/',
    type: 'paper'
  }
];
