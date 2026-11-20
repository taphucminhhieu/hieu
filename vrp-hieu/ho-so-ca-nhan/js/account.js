
// --- Dữ liệu xe yêu thích (dùng chung với trang chủ / danh sách xe) ---
let carsData = {
    'xe-may': [],
    'o-to': []
};

function syncFavorites() {
    const items = window.VRPFavorites ? window.VRPFavorites.list() : [];

    carsData['xe-may'] = items.filter(car => car.category !== 'o-to');
    carsData['o-to'] = items.filter(car => car.category === 'o-to');
}

syncFavorites();

let currentTab = 'xe-may';

// Hàm hiển thị danh sách xe
function renderCars() {
    const container = document.getElementById('cars-container');
    const countXeMay = document.getElementById('count-xe-may');
    const countOTo = document.getElementById('count-o-to');

    if (countXeMay && carsData['xe-may']) countXeMay.innerText = carsData['xe-may'].length;
    if (countOTo && carsData['o-to']) countOTo.innerText = carsData['o-to'].length;

    if (!container) return;

    const items = carsData[currentTab] || [];

    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
                <p>Chưa có chiếc xe nào trong danh sách yêu thích này.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(car => `
        <div class="car-card">
            <div class="car-image-box">
                <img src="${car.image}" alt="${car.name}">
                <div class="car-tags">
                    ${car.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button onclick="removeCar('${currentTab}', '${car.id}')" class="card-heart-btn" title="Bỏ thích">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>

            <div class="car-details">
                <div>
                    <h3 class="car-title">${car.name}</h3>
                    <div class="car-specs">
                        <span><i class="fa-solid fa-gear"></i> ${car.transmission}</span>
                        <span><i class="fa-solid fa-user-group"></i> ${car.seats}</span>
                        <span><i class="fa-solid fa-gas-pump"></i> ${car.fuel}</span>
                    </div>
                    <div class="car-rating">
                        <i class="fa-solid fa-star"></i> ${car.rating} <span>(${car.trips} chuyến)</span>
                    </div>
                    <div class="car-location">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${car.location}</span>
                    </div>
                </div>

                <div class="car-footer">
                    <div class="owner-info">
                        <img src="${car.ownerAvatar}" alt="${car.owner}" class="owner-avatar">
                        <span class="owner-name-text">${car.owner}</span>
                    </div>
                    <div class="car-price">
                        <span class="price-num">${car.price}</span>
                        <span class="price-unit">${car.period}</span>
                    </div>
                </div>
            </div>

            <div class="car-actions">
                <button onclick="removeCar('${currentTab}', '${car.id}')" class="btn-action btn-remove">Bỏ thích</button>
                <button class="btn-action btn-detail">Xem chi tiết</button>
            </div>
        </div>
    `).join('');
}

// Chuyển đổi tab
function switchTab(tab) {
    currentTab = tab;

    const tabTuLai = document.getElementById('tab-xe-may');
    const tabCoTaiXe = document.getElementById('tab-o-to');

    if (tab === 'xe-may') {
        if (tabTuLai) tabTuLai.classList.add('active');
        if (tabCoTaiXe) tabCoTaiXe.classList.remove('active');
    } else {
        if (tabCoTaiXe) tabCoTaiXe.classList.add('active');
        if (tabTuLai) tabTuLai.classList.remove('active');
    }

    renderCars();
}

// Xóa xe khỏi danh sách
function removeCar(tab, id) {
    if (window.VRPFavorites) {
        window.VRPFavorites.remove(id);
    }

    syncFavorites();
    renderCars();
}

// Hàm thông báo đã được tắt theo yêu cầu
function showToast() { }


// --- Quản lý hiển thị các View trong Tài khoản của tôi ---

// Ẩn tất cả các view chức năng
function hideAllAccountViews() {
    const viewIds = ['view-blank', 'view-profile', 'view-orders', 'view-favorites', 'view-reviews'];

    viewIds.forEach(id => {
        const el = document.getElementById(id);

        if (el) {
            el.style.display = 'none';
        }
    });
}

// Hiển thị khoảng trắng của tài khoản
function showBlankAccountView() {
    hideAllAccountViews();

    const blankView = document.getElementById('view-blank');

    if (blankView) {
        blankView.style.display = 'flex';
    }

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => item.classList.remove('active'));

    const selectText = document.getElementById('accountSelectText');

    if (selectText) {
        selectText.innerText = 'Tài khoản của tôi';
    }

    closeAccountDropdown();
    closeNavPopup();

    const accountSidebar = document.getElementById('accountSidebar');

    if (window.innerWidth <= 1024 && accountSidebar) {
        accountSidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Chuyển đổi và hiển thị chức năng tài khoản
function switchAccountView(itemName) {
    hideAllAccountViews();

    let targetViewId = 'view-favorites';
    let titleName = 'Danh sách của tôi';

    if (itemName === 'Hồ sơ của tôi') {
        targetViewId = 'view-profile';
        titleName = 'Hồ sơ của tôi';
    } else if (itemName === 'Đơn thuê của tôi') {
        targetViewId = 'view-orders';
        titleName = 'Đơn thuê của tôi';
    } else if (itemName === 'Danh sách của tôi' || itemName === 'Danh sách yêu thích') {
        targetViewId = 'view-favorites';
        titleName = 'Danh sách của tôi';
        renderCars();
    } else if (itemName === 'Đánh giá của tôi') {
        targetViewId = 'view-reviews';
        titleName = 'Đánh giá của tôi';
    }

    const targetEl = document.getElementById(targetViewId);

    if (targetEl) {
        targetEl.style.display = 'block';
    }

    const selectText = document.getElementById('accountSelectText');

    if (selectText) {
        selectText.innerText = titleName;
    }

    closeAccountDropdown();
}

// Lưu thông tin hồ sơ
function saveProfile(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('profileNameInput');

    if (nameInput && nameInput.value.trim()) {
        const newName = nameInput.value.trim();

        document.querySelectorAll('.user-name, .popup-name').forEach(el => {
            el.innerText = newName;
        });
    }
}


// Hiển thị ảnh giấy tờ vừa chọn (GPLX, CCCD mặt trước/sau)
function previewDoc(event, key) {
    const file = event.target.files && event.target.files[0];

    if (!file) return;

    if (!file.type || file.type.indexOf('image/') !== 0) {
        alert('Vui lòng chọn file ảnh JPG hoặc PNG.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const img = document.getElementById(key + 'PreviewImg');
        const wrap = document.getElementById(key + 'Preview');
        const name = document.getElementById(key + 'FileName');

        if (img) img.src = e.target.result;
        if (name) name.textContent = file.name;
        if (wrap) wrap.hidden = false;
    };

    reader.readAsDataURL(file);
}

// Xoá ảnh giấy tờ đã chọn
function removeDoc(key) {
    const input = document.getElementById(key + 'FileInput');
    const wrap = document.getElementById(key + 'Preview');
    const img = document.getElementById(key + 'PreviewImg');

    if (input) input.value = '';
    if (img) img.removeAttribute('src');
    if (wrap) wrap.hidden = true;
}


// --- Quản lý đơn thuê của tôi ---

let currentOrderFilter = 'all';
let selectedOrderCard = null;

// Bộ lọc đơn thuê xe
function filterOrders(status, btn) {
    currentOrderFilter = status;

    const tabs = document.querySelectorAll('.order-tabs .tab-btn');
    tabs.forEach(t => t.classList.remove('active'));

    if (btn) {
        btn.classList.add('active');
    }

    const orders = document.querySelectorAll('.order-list .order-card');

    orders.forEach(card => {
        if (status === 'all' || card.dataset.status === status) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    if (window.VRPDataState) {
        window.VRPDataState.refresh(document.querySelector('#view-orders .order-list'));
    }
}

// Cập nhật số lượng đơn trên các tab
function updateOrderCounts() {
    const orders = document.querySelectorAll('.order-list .order-card');
    const tabs = document.querySelectorAll('.order-tabs .tab-btn');

    const counts = {
        all: orders.length,
        pending: 0,
        confirmed: 0,
        renting: 0,
        completed: 0,
        cancelled: 0
    };

    orders.forEach(card => {
        const status = card.dataset.status;

        if (counts[status] !== undefined) {
            counts[status]++;
        }
    });

    const labels = [
        `Tất cả (${counts.all})`,
        `Chờ xác nhận (${counts.pending})`,
        `Đã xác nhận (${counts.confirmed})`,
        `Đang thuê (${counts.renting})`,
        `Đã hoàn thành (${counts.completed})`,
        `Đã hủy (${counts.cancelled})`
    ];

    tabs.forEach((tab, index) => {
        if (labels[index]) {
            tab.innerText = labels[index];
        }
    });
}

// Hiển thị chi tiết đơn thuê
function showOrderDetail(button) {
    const orderCard = button.closest('.order-card');

    if (!orderCard) return;

    const carName = orderCard.querySelector('.order-car-title').innerText;
    const orderInfo = orderCard.querySelectorAll('.order-meta');
    const orderStatus = orderCard.querySelector('.order-badge').innerText;
    const total = orderCard.querySelector('.order-total-price').innerText;

    document.getElementById('detailCarName').innerText = carName;
    document.getElementById('detailOrderCode').innerText = orderInfo[0].innerText.replace('Mã đơn: ', '');
    document.getElementById('detailOrderStatus').innerText = orderStatus;
    document.getElementById('detailOrderDate').innerText = orderInfo[1].innerText.replace('Thời gian: ', '');
    document.getElementById('detailOrderLocation').innerText = orderInfo[2].innerText.replace('Nhận xe: ', '');
    document.getElementById('detailTotal').innerText = total;
    document.getElementById('detailDeposit').innerText = orderInfo[3].innerText.replace('Tiền cọc: ', '');

    document.getElementById('orderDetailModal').style.display = 'flex';
}

// Hiển thị cửa sổ xác nhận hủy đơn
function showCancelOrder(button) {
    selectedOrderCard = button.closest('.order-card');

    if (!selectedOrderCard) return;

    const orderInfo = selectedOrderCard.querySelectorAll('.order-meta');

    const orderCode = orderInfo[0].innerText.replace('Mã đơn: ', '');
    const deposit = orderInfo[3].innerText.replace('Tiền cọc: ', '');

    document.getElementById('cancelOrderCode').innerText = orderCode;
    document.getElementById('cancelOrderDeposit').innerText = deposit;
    document.getElementById('cancelRefundAmount').innerText = deposit;

    document.getElementById('cancelOrderModal').style.display = 'flex';
}

// Xác nhận hủy đơn thuê
function confirmCancelOrder() {
    if (!selectedOrderCard) return;

    selectedOrderCard.dataset.status = 'cancelled';

    const badge = selectedOrderCard.querySelector('.order-badge');
    badge.className = 'order-badge cancelled';
    badge.innerText = 'Đã hủy';

    const cancelButton = selectedOrderCard.querySelector('.btn-cancel');

    if (cancelButton) {
        cancelButton.remove();
    }

    updateOrderCounts();

    const tabs = document.querySelectorAll('.order-tabs .tab-btn');

    const tabIndexes = {
        all: 0,
        pending: 1,
        confirmed: 2,
        renting: 3,
        completed: 4,
        cancelled: 5
    };

    filterOrders(currentOrderFilter, tabs[tabIndexes[currentOrderFilter]]);

    closeOrderModal();

    selectedOrderCard = null;

}

// Đóng khung chi tiết hoặc hủy đơn
function closeOrderModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
    document.getElementById('cancelOrderModal').style.display = 'none';

    selectedOrderCard = null;
}


// --- Quản lý Popup Menu Mobile / iPad ---

function openNavPopup() {
    const popup = document.getElementById('navPopup');
    const overlay = document.getElementById('navPopupOverlay');

    if (popup && overlay) {
        popup.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeNavPopup() {
    const popup = document.getElementById('navPopup');
    const overlay = document.getElementById('navPopupOverlay');

    if (popup && overlay) {
        popup.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}


// --- Quản lý Ô nhỏ chọn Tài khoản của tôi ---

function toggleAccountDropdown(event) {
    if (event) event.stopPropagation();

    const sidebar = document.getElementById('accountSidebar');
    const btn = document.getElementById('accountSelectBtn');

    if (sidebar) {
        const isOpen = sidebar.classList.toggle('open');

        if (btn) {
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
    }
}

function closeAccountDropdown() {
    const sidebar = document.getElementById('accountSidebar');
    const btn = document.getElementById('accountSelectBtn');

    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');

        if (btn) {
            btn.setAttribute('aria-expanded', 'false');
        }
    }
}


// Khởi tạo các sự kiện điều hướng & dropdown
function initNavigationEvents() {
    const userProfileBtn = document.getElementById('userProfileBtn');

    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', showBlankAccountView);
    }

    const popupUserProfileBtn = document.getElementById('popupUserProfileBtn');

    if (popupUserProfileBtn) {
        popupUserProfileBtn.addEventListener('click', showBlankAccountView);
    }

    const hamburgerBtn = document.getElementById('hamburgerBtn');

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openNavPopup);
    }

    const popupCloseBtn = document.getElementById('popupCloseBtn');

    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', closeNavPopup);
    }

    const navPopupOverlay = document.getElementById('navPopupOverlay');

    if (navPopupOverlay) {
        navPopupOverlay.addEventListener('click', closeNavPopup);
    }

    const accountSelectBtn = document.getElementById('accountSelectBtn');

    if (accountSelectBtn) {
        accountSelectBtn.addEventListener('click', toggleAccountDropdown);

        accountSelectBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccountDropdown(e);
            }
        });
    }

    const sidebarItems = document.querySelectorAll('.sidebar-item');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const itemName = this.getAttribute('data-name') || this.innerText.trim();

            sidebarItems.forEach(si => si.classList.remove('active'));
            this.classList.add('active');

            switchAccountView(itemName);
        });
    });

    const desktopNavLinks = document.querySelectorAll('.nav-list li a');

    desktopNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            desktopNavLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const bellBtn = document.getElementById('bellBtn');

    if (bellBtn) {
        bellBtn.addEventListener('click', () => {
            // Đã tắt thông báo theo yêu cầu
        });
    }

    document.addEventListener('click', function (e) {
        const sidebar = document.getElementById('accountSidebar');

        if (sidebar && !sidebar.contains(e.target)) {
            closeAccountDropdown();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeNavPopup();
            closeAccountDropdown();
            closeOrderModal();
        }
    });
}


// --- Khởi chạy khi tải trang ---

window.onload = function () {
    syncFavorites();
    renderCars();
    initNavigationEvents();
    updateOrderCounts();

    // Tự động mở Đơn thuê của tôi khi chuyển từ thanh toán sang
    if (sessionStorage.getItem("openMyOrders") === "true") {
        sessionStorage.removeItem("openMyOrders");

        const orderMenuItem = document.querySelector(
            '.sidebar-item[data-name="Đơn thuê của tôi"]'
        );

        if (orderMenuItem) {
            document.querySelectorAll(".sidebar-item").forEach(function (item) {
                item.classList.remove("active");
            });

            orderMenuItem.classList.add("active");
        }

        switchAccountView("Đơn thuê của tôi");
    }
};
