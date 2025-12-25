'use strict';

/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

if (navToggler) {
  navToggler.addEventListener("click", function () {
    navbar.classList.toggle("active");
    this.classList.toggle("active");
  });
}

/**
 * HEADER & BACK TOP BTN
 * header and back top btn visible when window scroll down to 200px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElementOnScroll = function () {
  if (window.scrollY > 200) {
    header.classList.add("active");
    if(backTopBtn) backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    if(backTopBtn) backTopBtn.classList.remove("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);


/**
 * SLIDER
 */

const sliders = document.querySelectorAll("[data-slider]");

const sliderInit = function (currentSlider) {

  const sliderContainer = currentSlider.querySelector("[data-slider-container]");
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

  const totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue("--slider-item"));
  const totalSliderItems = sliderContainer.childElementCount - totalSliderVisibleItems;

  let currentSlidePos = 0;

  const moveSliderItem = function () {
    sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
  }

  /**
   * NEXT SLIDE
   */
  const slideNext = function () {
    const slideEnd = currentSlidePos >= totalSliderItems;

    if (slideEnd) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }

    moveSliderItem();
  }

  if(sliderNextBtn) sliderNextBtn.addEventListener("click", slideNext);

  /**
   * PREVIOUS SLIDE
   */
  const slidePrev = function () {
    if (currentSlidePos <= 0) {
      currentSlidePos = totalSliderItems;
    } else {
      currentSlidePos--;
    }

    moveSliderItem();
  }

  if(sliderPrevBtn) sliderPrevBtn.addEventListener("click", slidePrev);

  const dontHaveExtraItem = totalSliderItems <= 0;
  if (dontHaveExtraItem) {
    if(sliderNextBtn) sliderNextBtn.setAttribute("disabled", "");
    if(sliderPrevBtn) sliderPrevBtn.setAttribute("disabled", "");
  }

  /**
   * AUTO SLIDE
   */

  let autoSlideInterval;

  const startAutoSlide = () => autoSlideInterval = setInterval(slideNext, 3000);
  startAutoSlide();
  const stopAutoSlide = () => clearInterval(autoSlideInterval);

  currentSlider.addEventListener("mouseover", stopAutoSlide);

  currentSlider.addEventListener("mouseout", startAutoSlide);

  /**
   * RESPONSIVE
   */

  window.addEventListener("resize", moveSliderItem);

}

for (let i = 0, len = sliders.length; i < len; i++) { sliderInit(sliders[i]); }


/**
 * ACCORDION
 */

const accordions = document.querySelectorAll("[data-accordion]");

let lastActiveAccordion;

const accordionInit = function (currentAccordion) {

  const accordionBtn = currentAccordion.querySelector("[data-accordion-btn]");

  accordionBtn.addEventListener("click", function () {

    if (currentAccordion.classList.contains("active")) {
      currentAccordion.classList.toggle("active");
    } else {
      if (lastActiveAccordion) lastActiveAccordion.classList.remove("active");
      currentAccordion.classList.add("active");
    }

    lastActiveAccordion = currentAccordion;

  });

}

for (let i = 0, len = accordions.length; i < len; i++) { accordionInit(accordions[i]); }


/* ==========================================================================
   PHẦN MỚI: CART FUNCTIONALITY (CHỨC NĂNG GIỎ HÀNG)
   ========================================================================== */

/**
 * 1. Hàm thêm sản phẩm vào giỏ (Dùng ở trang chủ index.html)
 */
function addToCart(id, name, price, image) {
    // Lấy giỏ hàng từ bộ nhớ, nếu chưa có thì tạo mảng rỗng
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    // Kiểm tra xem sản phẩm này đã có trong giỏ chưa
    let existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // Nếu có rồi -> Tăng số lượng
        existingItem.quantity += 1;
    } else {
        // Nếu chưa có -> Thêm mới
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    // Lưu lại vào LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Thông báo cho người dùng
    alert(`Success! Added "${name}" to your wallet.`);
}

/**
 * 2. Hàm hiển thị giỏ hàng (Dùng ở trang cart.html)
 */
function displayCart() {
    const cartTable = document.getElementById('cart-table-body');
    const totalPriceEl = document.getElementById('total-price');
    
    // QUAN TRỌNG: Nếu không tìm thấy bảng giỏ hàng (tức là đang ở trang chủ), thì dừng hàm này lại
    // Để tránh lỗi Javascript
    if (!cartTable) return;

    // Lấy dữ liệu
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    cartTable.innerHTML = ''; // Xóa nội dung cũ để vẽ lại
    let total = 0;

    if (cart.length === 0) {
        cartTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Your wallet is empty.</td></tr>';
    } else {
        cart.forEach((item) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Tạo dòng HTML cho từng sản phẩm
            let row = `
                <tr>
                    <td>
                        <img src="${item.image}" width="50" height="50" style="border-radius:5px; object-fit: cover;">
                    </td>
                    <td>${item.name}</td>
                    <td>${item.price} ETH</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button onclick="changeQuantity(${item.id}, -1)" style="padding: 2px 8px; background: #333; color: white; border: none; cursor: pointer;">-</button> 
                            <span>${item.quantity}</span> 
                            <button onclick="changeQuantity(${item.id}, 1)" style="padding: 2px 8px; background: #333; color: white; border: none; cursor: pointer;">+</button>
                        </div>
                    </td>
                    <td>${itemTotal.toFixed(2)} ETH</td>
                    <td>
                        <button onclick="removeItem(${item.id})" style="color: #ff4d4d; background: none; border: none; cursor: pointer; font-size: 1.2rem;">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </td>
                </tr>
            `;
            cartTable.innerHTML += row;
        });
    }

    // Cập nhật tổng tiền
    if(totalPriceEl) {
        totalPriceEl.innerText = total.toFixed(3) + ' ETH';
    }
}

/**
 * 3. Hàm tăng giảm số lượng
 */
function changeQuantity(id, amount) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let item = cart.find(i => i.id === id);

    if (item) {
        item.quantity += amount;
        
        // Nếu giảm xuống 0 hoặc thấp hơn thì xóa luôn sản phẩm
        if (item.quantity <= 0) {
            const confirmDelete = confirm("Remove this item?");
            if(confirmDelete) {
                cart = cart.filter(i => i.id !== id);
            } else {
                item.quantity = 1; // Nếu không xóa thì reset về 1
            }
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); // Vẽ lại giao diện
}

/**
 * 4. Hàm xóa hẳn sản phẩm
 */
function removeItem(id) {
    if(confirm("Are you sure you want to remove this item?")) {
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart = cart.filter(item => item.id !== id);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Khi trang web tải xong, hãy thử chạy hàm displayCart
// (Nó sẽ tự động kiểm tra xem có đang ở trang cart hay không)
document.addEventListener('DOMContentLoaded', displayCart);