let test = {
  rc: '13661399',
  from: 'Рудых Вадим Андреевич',
  dept: 'Управление цифровой трансформации',
  org: 'ГБУ РС(Я) "Республиканский центр инфокоммуникационных технологий"',
  type: 'Поручение',
  send: 1,
  input_id: 'ObjectId=5f632c31f321063568e2d3e4',
  send_id: [
    'ObjectId=5f632c35f321063568e2d3e9',
    'ObjectId=5f632c36f321063568e2d3ea'
  ],
  res_id: [
    'ObjectId=5f632c31f321063568e2d3e5',
    'ObjectId=5f632c32f321063568e2d3e6',
    'ObjectId=5f632c33f321063568e2d3e7',
    'ObjectId=5f632c33f321063568e2d3e8'
  ]
}

asd = async (data) => {
  let result = data
  return Promise.all(
    Object.entries(result).map((ent) => {
      if (Array.isArray(ent[1])) {
        let tmp = []
        Promise.all(
          ent[1].map((val) => {
            tmp.push(val.toString().replace('ObjectId=', ''))
          })
        ).then(() => {
          result[ent[0]] = tmp
        })
      }
      else {
        result[ent[0]] = ent[1].toString().replace('ObjectId=', '')
      }
    })
  ).then(() => {
    return result
  })
}

async function init() {
  console.log(await asd(test))
}

init()