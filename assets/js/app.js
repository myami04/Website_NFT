/* assets/js/app.js */

// Dữ liệu sản phẩm mẫu (Giả lập Database)
const PRODUCTS = [
    { id: 1, name: "Virtual Art #01", price: 2.5, img: "./assets/images/auction-1.jpg", creator: "Ralph Edwards" },
    { id: 2, name: "Cyber Punk #88", price: 1.8, img: "./assets/images/auction-2.jpg", creator: "Jason Statham" },
    { id: 3, name: "Bored Ape Metal", price: 5.2, img: "./assets/images/auction-3.jpg", creator: "Satoshi" },
    { id: 4, name: "Abstract 3D", price: 0.9, img: "./assets/images/discover-1.jpg", creator: "Musk Elon" },
    { id: 5, name: "Space Walker", price: 3.4, img: "./assets/images/discover-2.jpg", creator: "Moon Boy" },
    { id: 6, name: "Neon District", price: 1.2, img: "./assets/images/discover-3.jpg", creator: "Cyber Girl" },
];

// --- 1. Xử lý Đăng Nhập ---
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    // Tạo user giả
    const user = {
        name: email.split('@')[0], // Lấy tên từ email
        email: email,
        avatar: "./assets/images/avatar-1.jpg", // Dùng ảnh có sẵn trong thư mục assets
        balance: "12.5"
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'index.html';
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const path = window.location.pathname;

    // Bảo vệ trang Cart và Profile
    if (!user && (path.includes('profile.html') || path.includes('cart.html'))) {
        window.location.href = 'login.html';
    }

    // Hiển thị thông tin user nếu đã login
    if (user) {
        document.querySelectorAll('.u-name').forEach(el => el.innerText = user.name);
        document.querySelectorAll('.u-email').forEach(el => el.innerText = user.email);
        document.querySelectorAll('.u-avatar').forEach(el => el.src = user.avatar);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// --- 2. Xử lý Shop (Render sản phẩm) ---
function renderShop() {
    const container = document.getElementById('shop-container');
    if (!container) return;

    container.innerHTML = PRODUCTS.map(product => `
        <li>
            <div class="card explore-card">
                <figure class="card-banner">
                    <img src="${product.img}" alt="${product.name}" class="img-cover" onerror="this.src='https://via.placeholder.com/300'">
                </figure>
                <div class="card-content">
                    <h3 class="h3 card-title"><a href="#">${product.name}</a></h3>
                    <span class="card-author">Tác giả: <a href="#" class="author-link">${product.creator}</a></span>
                    <div class="wrapper">
                        <div class="wrapper-item">
                            <span class="text-sm">Giá hiện tại</span>
                            <span class="card-price">${product.price} ETH</span>
                        </div>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <ion-icon name="bag-add-outline"></ion-icon>
                            <span>Thêm Giỏ</span>
                        </button>
                    </div>
                </div>
            </div>
        </li>
    `).join('');
}

// --- 3. Xử lý Giỏ Hàng ---
function addToCart(id) {
    // Kiểm tra đăng nhập trước
    if (!localStorage.getItem('currentUser')) {
        alert("Vui lòng đăng nhập để mua hàng!");
        window.location.href = 'login.html';
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = PRODUCTS.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm "${product.name}" vào giỏ!`);
}

function renderCart() {
    const tbody = document.getElementById('cart-body');
    const totalEl = document.getElementById('cart-total');
    if (!tbody) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#aaa;">Giỏ hàng của bạn đang trống. <a href="shop.html" style="color:var(--primary-purple)">Mua ngay</a></td></tr>`;
        if (totalEl) totalEl.innerText = "0 ETH";
        return;
    }

    tbody.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <tr>
                <td>
                    <div class="cart-item-info">
                        <img src="${item.img}" class="cart-img" onerror="this.src='https://via.placeholder.com/50'">
                        <div>
                            <h4>${item.name}</h4>
                            <span style="font-size:12px; color:#888;">${item.creator}</span>
                        </div>
                    </div>
                </td>
                <td>${item.price} ETH</td>
                <td>x ${item.qty}</td>
                <td style="color: var(--primary-purple); font-weight:bold;">${(item.price * item.qty).toFixed(2)} ETH</td>
                <td>
                    <button class="btn-delete" onclick="removeItem(${index})"><ion-icon name="trash-outline"></ion-icon></button>
                </td>
            </tr>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = total.toFixed(2) + " ETH";
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderShop();
    renderCart();
});
/* ==========================================================================
   CART LOGIC (HEADER VERSION)
   ========================================================================== */

// 1. Hàm cập nhật số lượng lên icon trên Header
function updateCartCount() {
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    // Tính tổng số lượng
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Tìm thẻ badge trên header
    const countElement = document.getElementById('cart-count');
    
    if (countElement) {
        countElement.innerText = totalCount;
        
        // Ẩn badge nếu giỏ hàng trống (tùy chọn, nếu muốn)
        if (totalCount === 0) {
            countElement.style.display = 'none';
        } else {
            countElement.style.display = 'flex';
        }
    }
}

// 2. Hàm thêm vào giỏ hàng
function addToCart(id, name, price, image) {
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    let existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount(); // Cập nhật số ngay lập tức
    
    // Hiệu ứng rung icon giỏ hàng khi thêm thành công
    const cartBtn = document.querySelector('.header-cart-btn');
    if(cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }

    alert(`Added "${name}" to your wallet!`);
}

// 3. Khởi chạy khi load trang
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); 
    // Nếu đang ở trang cart.html thì hiển thị bảng
    if(typeof displayCart === "function") displayCart(); 
});
/* === CƠ SỞ DỮ LIỆU SẢN PHẨM (MOCK DATA) === */
const productsDB = [
  {
    id: 1,
    name: "Genuine Undead #3902",
    price: 3.5,
    image: "./assets/images/showcase-8.gif",
    creator: "@StreetBoy",
    description: "Một tác phẩm nghệ thuật kỹ thuật số độc đáo thuộc bộ sưu tập Genuine Undead. Được tạo ra với phong cách Cyberpunk, mang lại vẻ đẹp ma mị và cuốn hút cho người sở hữu."
  },
  {
    id: 2,
    name: "Windchime #768",
    price: 3.5,
    image: "./assets/images/showcase-7.jpg",
    creator: "@CutieGirl",
    description: "Âm thanh của gió được hình tượng hóa qua lăng kính kỹ thuật số. Windchime #768 là sự kết hợp hoàn hảo giữa nghệ thuật tĩnh và cảm giác động."
  },
  {
    id: 3,
    name: "Probably A Label #3277",
    price: 3.5,
    image: "./assets/images/showcase-6.gif",
    creator: "@ButterFly",
    description: "Sự hỗn loạn có trật tự. Màu sắc rực rỡ và thiết kế táo bạo khiến tác phẩm này trở thành tâm điểm của mọi bộ sưu tập NFT."
  },
  {
    id: 4,
    name: "Probably A Label #1711",
    price: 3.5,
    image: "./assets/images/showcase-5.jpg",
    creator: "@NorseQueen",
    description: "Phong cách Viking kết hợp tương lai. Một chiến binh kỹ thuật số mang trong mình sức mạnh của thần thoại Bắc Âu."
  },
  {
    id: 5,
    name: "Shibuya Scramble Punks",
    price: 3.5,
    image: "./assets/images/showcase-4.jpg",
    creator: "@BigBull",
    description: "Lấy cảm hứng từ ngã tư đông đúc nhất thế giới tại Tokyo. Nhịp sống hối hả được cô đọng lại trong một khung hình tĩnh."
  },
  {
    id: 6,
    name: "Probably A Label #650",
    price: 3.5,
    image: "./assets/images/showcase-3.jpg",
    creator: "@Angel",
    description: "Vẻ đẹp thuần khiết pha chút nổi loạn. Tác phẩm này thể hiện sự tự do và khát vọng vươn lên."
  },
  {
    id: 7,
    name: "Looki #0147",
    price: 3.5,
    image: "./assets/images/showcase-2.jpg",
    creator: "@CrazyAnyone",
    description: "Đôi mắt nhìn thấu tâm can. Looki #0147 không chỉ là một bức ảnh, nó là một tấm gương phản chiếu người xem."
  },
  {
    id: 8,
    name: "Poob #285",
    price: 3.5,
    image: "./assets/images/showcase-1.jpg",
    creator: "@Princess",
    description: "Dễ thương nhưng đầy cá tính. Poob #285 là lựa chọn hoàn hảo cho những ai yêu thích phong cách hoạt hình hiện đại."
  }
];

/* --- JS XỬ LÝ PROFILE MENU --- */
  
  // Hàm toggle: Bật/Tắt menu khi bấm vào icon avatar
  function toggleProfileMenu() {
      const dropdown = document.getElementById('profileDropdown');
      const btn = document.querySelector('.header-profile-btn');
      
      dropdown.classList.toggle('active');
      btn.classList.toggle('active'); // Đổi màu nút khi đang mở
  }

  // Sự kiện click ra ngoài để đóng menu
  window.addEventListener('click', function(e) {
      const wrapper = document.querySelector('.profile-wrapper');
      const dropdown = document.getElementById('profileDropdown');
      const btn = document.querySelector('.header-profile-btn');

      // Nếu click KHÔNG nằm trong vùng profile-wrapper thì đóng menu
      if (!wrapper.contains(e.target)) {
          dropdown.classList.remove('active');
          btn.classList.remove('active');
      }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-message');

            // Tài khoản mẫu
            const validEmail = "tramy@gmail.com";
            const validPass = "1234";

            if (email === validEmail && password === validPass) {
                // Thành công
                errorMsg.style.display = 'none';
                alert("Đăng nhập thành công! Đang chuyển hướng...");
                window.location.href = 'index.html'; 
            } else {
                // Thất bại
                errorMsg.style.display = 'block';
                // Hiệu ứng rung nhẹ
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
            }
        });
    }
});