/* 代码压缩 */
const path = require('path');
const fs = require('fs');
const terser = require('terser');

function readFile(file){
  return new Promise((resolve, reject)=>{
    fs.readFile(file, (err, data)=>{
      if(err){
        reject(err);
      }else{
        resolve(data.toString());
      }
    })
  }).catch((err)=>{
    console.error(err);
  });
}

function writeFile(file, data){
  return new Promise((resolve, reject)=>{
    fs.writeFile(file, data, (err)=>{
      if(err){
        reject(err);
      }else{
        resolve();
      }
    })
  }).catch((err)=>{
    console.error(err);
  });
}

(async function(){
  // 压缩
  const code = await readFile(path.join(__dirname, 'scripts/gt.js'));
  const gt = terser.minify(code);

  await writeFile(path.join(__dirname, '../src/gt.min.js'), gt.code);
})();