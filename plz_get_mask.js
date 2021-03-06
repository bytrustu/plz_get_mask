const axios = require('axios');
const cheerio = require('cheerio');
const urls = [
  {
    name : '상공양행 KF94 나인포 게릴라',
    url : 'https://smartstore.naver.com/sangkong/products/4762917002',
    etc : 'naver-store'
  },
  {
    name : '아에르 KF94 스탠다드 베이직',
    url : 'https://smartstore.naver.com/aer-shop/products/4722827602',
    etc : 'naver-store'
  },
  {
    name : '국대 KF94 미세먼지',
    url : 'https://smartstore.naver.com/korea-mask/products/4825762296',
    etc : 'naver-store'
  },
  {
    name : '닥터퓨리 KF94 미세먼지',
    url : 'https://smartstore.naver.com/mfbshop/products/4072573492',
    etc : 'naver-store'
  },
  {
    name : '에티카 KF94 미세먼지',
    url : 'https://smartstore.naver.com/etiqa/products/4817982860',
    etc : 'naver-store'
  },
  {
    name : '네퓨어 KF94 미세먼지 끈길이조절',
    url : 'https://smartstore.naver.com/gonggami/products/4705579501',
    etc : 'naver-store'
  }
]

const getHtml = async (url) => {
    try {
        return await axios.get(url);
    } catch (error) {
        console.error(error);
    }
};

const plzGetMask = (urls) => {
  const data = urls.map(info => {
    const {name, url, etc} = info;
    return getHtml(url).then(html => {
      try {
        const $ = cheerio.load(html.data);
        const payEl = $('.not_goods > p > em');
        const payText = payEl.text();
        if (payText === '구매하실 수 없는') {
          return {state: 'false', ...info};
        } else {
          return {state: 'success', ...info};
        }
      } catch (e) {
        return {state: 'error', ...info};
      }
    })
  });

  Promise.all(data).then(v => {
    const sucFilter = v.filter(info => info.state === 'success');
    if (sucFilter.length == 0) {
      console.log(`판매중인 물품이 없습니다.`);
    } else {
      sucFilter.map(item => {
        const {name, url} = item;
        console.log(`제품 : ${name}`);
        console.log(`url : ${url}`);
        console.log(`=========================`)
      })
    }
  })
}

plzGetMask(urls);
