const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script id="engine">([\s\S]*?)<\/script>/);
const ctx={console,Math,Object,Array,JSON,parseInt,String,globalThis:{}};
ctx.globalThis=ctx; vm.createContext(ctx); vm.runInContext(m[1],ctx,{filename:'engine.js'});
const SF=ctx.SF;

function gridToString(g){
  let out='';
  for(let r=0;r<9;r++){
    let row='';
    for(let c=0;c<9;c++){ row += (g[r*9+c]||'.') + (c===8?'':' '); }
    out += row + '\n';
  }
  return out;
}

const seed='晨星-2026';
const g=SF.generate(seed, 30);
let txt='';
txt += 'SEED: '+seed+'\n';
txt += 'GIVENS: '+g.givens+'\n';
txt += 'UNIQUE: '+(SF.countSolutions(g.puzzle,2)===1)+'\n';
txt += '\n--- PUZZLE ---\n'+gridToString(g.puzzle);
txt += '\n--- SOLUTION ---\n'+gridToString(g.solution);
const sol=SF.solve(g.puzzle);
txt += '\nSOLVE==SOLUTION: '+(JSON.stringify(sol)===JSON.stringify(g.solution))+'\n';

fs.writeFileSync(path.join(__dirname,'_probe.txt'), txt);
console.log(txt);
