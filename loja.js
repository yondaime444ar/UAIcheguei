(() => {
  const CART_KEY = "uai-cheguei-cart";
  const FAV_KEY = "uai-cheguei-favorites";
  const money = value => value.toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const getCart = () => read(CART_KEY, []);
  const setCart = cart => { save(CART_KEY, cart); updateCount(); };
  const updateCount = () => {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
  };
  let toastTimer;
  const toast = message => {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2100);
  };

  if (document.body.dataset.page === "store") {
    let activeCategory = "Todos";
    let onlyFavorites = false;
    let favorites = read(FAV_KEY, []);
    const cards = [...document.querySelectorAll(".product-card")];
    const search = document.getElementById("searchInput");
    const filter = () => {
      const term = search.value.trim().toLocaleLowerCase("pt-BR");
      let visible = 0;
      cards.forEach(card => {
        const matchText = (card.dataset.name + " " + card.dataset.description + " " + card.dataset.category).toLocaleLowerCase("pt-BR").includes(term);
        const matchCategory = activeCategory === "Todos" || card.dataset.category === activeCategory;
        const matchFavorite = !onlyFavorites || favorites.includes(card.dataset.id);
        card.hidden = !(matchText && matchCategory && matchFavorite);
        if (!card.hidden) visible++;
      });
      document.getElementById("resultCount").textContent = visible + (visible === 1 ? " opção" : " opções");
      document.getElementById("emptyResults").hidden = visible !== 0;
    };
    document.querySelectorAll(".category-pill[data-category]").forEach(button => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        document.querySelectorAll(".category-pill[data-category]").forEach(item => item.classList.toggle("active", item === button));
        filter();
      });
    });
    search.addEventListener("input", filter);
    document.getElementById("favoritesFilter").addEventListener("click", event => {
      onlyFavorites = !onlyFavorites;
      event.currentTarget.setAttribute("aria-pressed", String(onlyFavorites));
      event.currentTarget.querySelector("span").textContent = onlyFavorites ? "♥" : "♡";
      filter();
      document.getElementById("cardapio").scrollIntoView({behavior:"smooth"});
    });
    cards.forEach(card => {
      const favoriteButton = card.querySelector(".favorite-button");
      const refreshFavorite = () => {
        const active = favorites.includes(card.dataset.id);
        favoriteButton.setAttribute("aria-pressed", String(active));
        favoriteButton.textContent = active ? "♥" : "♡";
      };
      refreshFavorite();
      favoriteButton.addEventListener("click", () => {
        favorites = favorites.includes(card.dataset.id) ? favorites.filter(id => id !== card.dataset.id) : [...favorites, card.dataset.id];
        save(FAV_KEY, favorites);
        refreshFavorite();
        filter();
        toast(favorites.includes(card.dataset.id) ? "Adicionado aos favoritos!" : "Removido dos favoritos.");
      });
      card.querySelector(".add-button").addEventListener("click", () => {
        const cart = getCart();
        const found = cart.find(item => item.id === card.dataset.id);
        if (found) found.quantity++;
        else cart.push({id:card.dataset.id,name:card.dataset.name,description:card.dataset.description,price:Number(card.dataset.price),image:card.dataset.image,quantity:1});
        setCart(cart);
        toast(card.dataset.name + " adicionado ao carrinho!");
      });
    });
  }

  if (document.body.dataset.page === "cart") {
    const list = document.getElementById("cartItems");
    const subtotalEl = document.getElementById("subtotal");
    const deliveryEl = document.getElementById("delivery");
    const discountEl = document.getElementById("discount");
    const totalEl = document.getElementById("total");
    const couponMessage = document.getElementById("couponMessage");
    const couponInput = document.getElementById("couponInput");
    let coupon = "";
    const coupons = {UAI10:{type:"percent",value:10},BEMVINDO5:{type:"fixed",value:5},FRETEGRATIS:{type:"delivery",value:0}};
    const render = () => {
      const cart = getCart();
      list.innerHTML = "";
      if (!cart.length) {
        list.innerHTML = '<div class="empty-cart"><span>🛍️</span><h2>Seu carrinho está esperando</h2><p>Escolha alguma delícia no cardápio para começar.</p><a class="checkout-button" href="principal.html">Explorar cardápio</a></div>';
      } else {
        cart.forEach(item => {
          const row = document.createElement("article");
          row.className = "cart-item";
          row.innerHTML = '<img alt=""><div class="cart-item-info"><span class="cart-item-category">UAI CHEGUEI</span><h3></h3><p></p><button class="remove-item" type="button">Remover</button></div><div class="cart-item-actions"><strong></strong><div class="quantity-control"><button type="button" data-change="-1" aria-label="Diminuir quantidade">−</button><span></span><button type="button" data-change="1" aria-label="Aumentar quantidade">+</button></div></div>';
          row.querySelector("img").src = item.image;
          row.querySelector("img").alt = item.name;
          row.querySelector("h3").textContent = item.name;
          row.querySelector("p").textContent = item.description;
          row.querySelector(".cart-item-actions strong").textContent = money(item.price * item.quantity);
          row.querySelector(".quantity-control span").textContent = item.quantity;
          row.querySelector(".remove-item").addEventListener("click", () => { setCart(getCart().filter(product => product.id !== item.id)); render(); });
          row.querySelectorAll("[data-change]").forEach(button => button.addEventListener("click", () => {
            const next = getCart().map(product => product.id === item.id ? {...product,quantity:product.quantity + Number(button.dataset.change)} : product).filter(product => product.quantity > 0);
            setCart(next); render();
          }));
          list.appendChild(row);
        });
      }
      const subtotal = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
      const delivery = subtotal === 0 || (coupon === "FRETEGRATIS") || subtotal >= 80 ? 0 : 7.90;
      const rule = coupons[coupon];
      let discount = 0;
      if (rule?.type === "percent") discount = subtotal * rule.value / 100;
      if (rule?.type === "fixed") discount = Math.min(rule.value, subtotal);
      subtotalEl.textContent = money(subtotal);
      deliveryEl.textContent = delivery === 0 ? "Grátis" : money(delivery);
      discountEl.textContent = discount ? "− " + money(discount) : money(0);
      totalEl.textContent = money(Math.max(0, subtotal + delivery - discount));
      document.getElementById("checkoutButton").disabled = cart.length === 0;
    };
    document.getElementById("applyCoupon").addEventListener("click", () => {
      const value = couponInput.value.trim().toUpperCase();
      if (!coupons[value]) { couponMessage.textContent = "Cupom não encontrado. Confira o código."; couponMessage.className = "coupon-message error"; return; }
      coupon = value;
      couponMessage.textContent = "Cupom " + value + " aplicado!";
      couponMessage.className = "coupon-message success";
      render();
    });
    document.getElementById("checkoutButton").addEventListener("click", () => {
      if (!getCart().length) return;
      document.getElementById("checkoutNotice").hidden = false;
      document.getElementById("checkoutNotice").scrollIntoView({behavior:"smooth",block:"center"});
    });
    updateCount();
    render();
  }
  updateCount();
})();