(() => {
  const KEY = "uai-cheguei-operacao-demo-v1";
  const defaults = {goal:30,tiers:[{count:10,bonus:30},{count:20,bonus:80},{count:30,bonus:150}],completed:0};
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (!saved) return structuredClone(defaults);
      return {...defaults,...saved,tiers:Array.isArray(saved.tiers)?saved.tiers:structuredClone(defaults.tiers)};
    } catch { return structuredClone(defaults); }
  };
  const save = data => localStorage.setItem(KEY,JSON.stringify(data));
  const money = value => Number(value).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const bonusFor = data => data.tiers.reduce((best,tier)=>data.completed>=tier.count?Math.max(best,tier.bonus):best,0);
  const percent = data => Math.min(100,Math.round(data.completed/Math.max(1,data.goal)*100));
  const el = id => document.getElementById(id);
  const renderMilestones = (container,data,driver) => {
    container.innerHTML = "";
    data.tiers.forEach((tier,index) => {
      const reached = data.completed >= tier.count;
      const item = document.createElement("div");
      item.className = (driver?"reward-level":"milestone-row") + (reached?" reached":"");
      if(driver){
        const label=document.createElement("span");label.textContent="Faixa "+(index+1)+" · "+tier.count+" entregas";
        const value=document.createElement("strong");value.textContent=money(tier.bonus);
        const status=document.createElement("small");status.textContent=reached?"Conquistada":"A conquistar";
        item.append(label,value,status);
      } else {
        const label=document.createElement("span");label.textContent="Faixa "+(index+1)+" · "+tier.count+" entregas";
        const value=document.createElement("strong");value.textContent=money(tier.bonus)+(reached?" · atingida":"");
        item.append(label,value);
      }
      container.appendChild(item);
    });
  };
  const renderOwner = data => {
    el("ownerDeliveries").textContent=data.completed;
    el("ownerGoal").textContent=data.goal;
    el("ownerBonus").textContent=money(bonusFor(data));
    el("teamDeliveries").textContent=data.completed;
    el("teamBonus").textContent=money(bonusFor(data));
    el("ownerProgressText").textContent=data.completed+" de "+data.goal;
    el("ownerPercent").textContent=percent(data)+"%";
    el("ownerProgressBar").style.width=percent(data)+"%";
    el("ownerProgressCaption").textContent=data.completed>=data.goal?"Meta de demonstração alcançada!":(data.goal-data.completed)+" entregas para atingir a meta.";
    renderMilestones(el("ownerMilestones"),data,false);
  };
  const renderRider = data => {
    el("riderDeliveries").textContent=data.completed;
    el("riderBonus").textContent=money(bonusFor(data));
    el("riderBonusLarge").textContent=money(bonusFor(data));
    el("riderRemaining").textContent=Math.max(0,data.goal-data.completed);
    el("riderPercent").textContent=percent(data)+"% concluído";
    el("riderProgressText").textContent=data.completed+" de "+data.goal+" entregas";
    el("riderGoalStatus").textContent=data.completed>=data.goal?"Meta de demonstração alcançada!":"Continue no seu ritmo e com segurança.";
    el("riderProgressBar").style.width=percent(data)+"%";
    renderMilestones(el("riderMilestones"),data,true);
  };
  const valid = data => data.goal>0 && data.tiers.every((tier,i)=>tier.count>0&&tier.bonus>=0&&(i===0||tier.count>data.tiers[i-1].count));
  const data=read();
  if(document.body.dataset.panel==="owner"){
    el("weeklyGoal").value=data.goal;
    data.tiers.forEach((tier,i)=>{el("tier"+(i+1)+"Count").value=tier.count;el("tier"+(i+1)+"Bonus").value=tier.bonus;});
    renderOwner(data);
    el("bonusForm").addEventListener("submit",event=>{
      event.preventDefault();
      const next={...read(),goal:Number(el("weeklyGoal").value),tiers:[1,2,3].map(i=>({count:Number(el("tier"+i+"Count").value),bonus:Number(el("tier"+i+"Bonus").value)}))};
      if(!valid(next)){el("settingsFeedback").textContent="Confira: metas devem ser crescentes e valores não podem ser negativos.";return;}
      save(next);renderOwner(next);el("settingsFeedback").textContent="Regras de demonstração salvas neste navegador.";
    });
    window.addEventListener("storage",event=>{if(event.key===KEY)renderOwner(read());});
  }
  if(document.body.dataset.panel==="rider"){
    renderRider(data);
    el("completeDemoDelivery").addEventListener("click",()=>{
      const next=read();next.completed+=1;save(next);renderRider(next);
      el("riderFeedback").textContent="Entrega de teste registrada. Nenhum pedido real foi alterado.";
    });
    el("resetDemo").addEventListener("click",()=>{
      const next=read();next.completed=0;save(next);renderRider(next);
      el("riderFeedback").textContent="Contador da demonstração reiniciado.";
    });
    window.addEventListener("storage",event=>{if(event.key===KEY)renderRider(read());});
  }
})();