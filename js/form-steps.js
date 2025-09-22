// ===================================
// Form Steps Management (Updated)
// ===================================

class FormStepManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 6; // 同意確認 → 基本情報 → 地図範囲 → 詳細エリア → 思い出の場所 → 確認・送信
    this.formData = {
      // 個人情報同意
      privacyAgreement: false,
      
      // 基本情報
      name: '',
      admissionYear: '',
      department: '',
      
      // 地図・場所情報
      mapType: null,
      area: null,
      placeName: '',
      memoryContent: '',
      locationInfo: '',
      
      // 写真情報
      photoFile: null,
      photoUrl: '',
      photoType: 'file', // 'file' or 'url'
      
      // 海外の場合
      usefulPhrase: '',
      
      // 同意
      agreement: false
    };
    
    this.prefectures = [
      '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
      '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
      '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
      '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
      '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
      '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
      '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
    ];
    
    this.regions = {
      'asia': 'アジア',
      'europe': 'ヨーロッパ',
      'africa': 'アフリカ',
      'oceania': 'オセアニア',
      'north-america': '北米',
      'south-america': '南米'
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.generatePrefectureButtons();
    this.setupPhotoUpload();
    this.setupHelpModal();
    this.updateUI();
    console.log('📝 FormStepManager初期化完了（新バージョン）');
  }
  
  bindEvents() {
    // Navigation buttons
    document.getElementById('next-btn')?.addEventListener('click', () => this.nextStep());
    document.getElementById('prev-btn')?.addEventListener('click', () => this.prevStep());
    document.getElementById('submit-btn')?.addEventListener('click', () => this.submitForm());
    
    // Step 0: 個人情報同意
    const privacyCheckbox = document.getElementById('privacy-agreement');
    if (privacyCheckbox) {
      privacyCheckbox.addEventListener('change', (e) => {
        this.formData.privacyAgreement = e.target.checked;
        console.log(`📝 プライバシー同意が変更されました: ${e.target.checked}`);
        this.updateNavigationButtons();
      });
    } else {
      console.error('❌ privacy-agreement 要素が見つかりません');
    }
    
    // Step 1: 基本情報
    document.getElementById('user-name')?.addEventListener('input', (e) => {
      this.formData.name = e.target.value;
    });
    
    document.getElementById('admission-year')?.addEventListener('change', (e) => {
      this.formData.admissionYear = e.target.value;
      console.log(`📝 入学年度が変更されました: ${e.target.value}`);
    });
    
    const departmentField = document.getElementById('department');
    if (departmentField) {
      departmentField.addEventListener('change', (e) => {
        this.formData.department = e.target.value;
        console.log(`📝 所属学部が変更されました: ${e.target.value}`);
      });
      console.log('✅ departmentセレクトフィールドが見つかりました');
    } else {
      console.error('❌ departmentフィールドが見つかりません');
    }
    
    // Step 2: 地図範囲選択
    document.querySelectorAll('.map-option').forEach(option => {
      option.addEventListener('click', () => this.selectMapType(option.dataset.map));
    });
    
    // Step 3: 詳細エリア選択
    document.querySelectorAll('.region-option').forEach(option => {
      option.addEventListener('click', () => this.selectRegion(option.dataset.region));
    });
    
    // Step 4: 思い出の場所情報
    document.getElementById('place-name')?.addEventListener('input', (e) => {
      this.formData.placeName = e.target.value;
    });
    
    document.getElementById('memory-content')?.addEventListener('input', (e) => {
      this.formData.memoryContent = e.target.value;
    });
    
    document.getElementById('location-info')?.addEventListener('input', (e) => {
      this.formData.locationInfo = e.target.value;
    });
    
    document.getElementById('photo-url')?.addEventListener('input', (e) => {
      this.formData.photoUrl = e.target.value;
    });
    
    document.getElementById('useful-phrase')?.addEventListener('input', (e) => {
      this.formData.usefulPhrase = e.target.value;
    });
    
    // Step 5: 同意確認
    document.getElementById('agreement-checkbox')?.addEventListener('change', (e) => {
      this.formData.agreement = e.target.checked;
      this.updateNavigationButtons();
    });
  }
  
  generatePrefectureButtons() {
    const grid = document.querySelector('.prefecture-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    this.prefectures.forEach(prefecture => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'prefecture-btn';
      button.dataset.prefecture = prefecture;
      button.textContent = prefecture;
      
      button.addEventListener('click', () => this.selectPrefecture(prefecture));
      
      grid.appendChild(button);
    });
  }
  
  setupPhotoUpload() {
    // Photo tab switching
    document.querySelectorAll('.photo-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabType = tab.dataset.tab;
        this.switchPhotoTab(tabType);
      });
    });
    
    // File upload
    const fileInput = document.getElementById('photo-file');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.handleFileUpload(e.target.files[0]);
      });
    }
  }
  
  setupHelpModal() {
    // Location help button
    document.getElementById('location-help-btn')?.addEventListener('click', () => {
      this.showHelpModal();
    });
    
    // Floating help button
    document.getElementById('floating-help-btn')?.addEventListener('click', () => {
      this.showHelpModal();
    });
    
    // Modal close button
    document.getElementById('help-modal-close')?.addEventListener('click', () => {
      this.hideHelpModal();
    });
    
    // Modal overlay click
    document.getElementById('help-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.hideHelpModal();
      }
    });
    
    // Help tabs
    document.querySelectorAll('.help-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabType = tab.dataset.tab;
        this.switchHelpTab(tabType);
      });
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideHelpModal();
      }
    });
  }
  
  switchPhotoTab(tabType) {
    this.formData.photoType = tabType;
    
    // Update tab buttons
    document.querySelectorAll('.photo-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabType);
    });
    
    // Update tab content
    document.querySelectorAll('.photo-tab-content').forEach(content => {
      const isActive = content.id === `photo-${tabType}-tab`;
      content.classList.toggle('active', isActive);
    });
    
    console.log(`📷 写真タブ切り替え: ${tabType}`);
  }
  
  handleFileUpload(file) {
    if (!file) return;
    
    // File size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showNotification('ファイルサイズが大きすぎます（最大5MB）', 'error');
      return;
    }
    
    // File type check
    if (!file.type.startsWith('image/')) {
      this.showNotification('画像ファイルを選択してください', 'error');
      return;
    }
    
    this.formData.photoFile = file;
    this.showPhotoPreview(file);
    
    console.log(`📸 写真アップロード: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  }
  
  showPhotoPreview(file) {
    const preview = document.getElementById('photo-preview');
    if (!preview) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `
        <img src="${e.target.result}" alt="アップロードされた写真">
        <div class="photo-preview-info">
          <div><strong>${file.name}</strong></div>
          <div>${(file.size / 1024 / 1024).toFixed(2)} MB</div>
        </div>
      `;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  
  showHelpModal() {
    const modal = document.getElementById('help-modal-overlay');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }
  
  hideHelpModal() {
    const modal = document.getElementById('help-modal-overlay');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }
  
  switchHelpTab(tabType) {
    // Update tab buttons
    document.querySelectorAll('.help-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabType);
    });
    
    // Update tab content
    document.querySelectorAll('.help-tab-content').forEach(content => {
      const isActive = content.id === `help-${tabType}-tab`;
      content.classList.toggle('active', isActive);
    });
  }
  
  selectMapType(mapType) {
    this.formData.mapType = mapType;
    this.formData.area = null; // Reset area selection
    
    // Update UI
    document.querySelectorAll('.map-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.map === mapType);
    });
    
    // Show appropriate area selection
    this.updateAreaSelection();
    
    // Show/hide useful phrase field based on world selection
    this.updateUsefulPhraseVisibility();
    
    // Enable next button
    this.updateNavigationButtons();
    
    console.log(`🗺️ 地図タイプ選択: ${mapType}`);
  }
  
  selectPrefecture(prefecture) {
    this.formData.area = prefecture;
    
    // Update UI
    document.querySelectorAll('.prefecture-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.prefecture === prefecture);
    });
    
    // Enable next button
    this.updateNavigationButtons();
    
    console.log(`🏛️ 都道府県選択: ${prefecture}`);
  }
  
  selectRegion(region) {
    this.formData.area = this.regions[region];
    
    // Update UI
    document.querySelectorAll('.region-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.region === region);
    });
    
    // Enable next button
    this.updateNavigationButtons();
    
    console.log(`🌍 地域選択: ${this.regions[region]}`);
  }
  
  updateAreaSelection() {
    const japanArea = document.getElementById('japan-area');
    const worldArea = document.getElementById('world-area');
    
    // Hide all area selections first
    if (japanArea) japanArea.style.display = 'none';
    if (worldArea) worldArea.style.display = 'none';
    
    // Show appropriate area selection
    if (this.formData.mapType === 'japan' && japanArea) {
      japanArea.style.display = 'block';
    } else if (this.formData.mapType === 'world' && worldArea) {
      worldArea.style.display = 'block';
    }
  }
  
  updateUsefulPhraseVisibility() {
    const phraseGroup = document.getElementById('useful-phrase-group');
    const floatingBtn = document.getElementById('floating-help-btn');
    
    if (this.formData.mapType === 'world') {
      if (phraseGroup) phraseGroup.style.display = 'block';
      if (floatingBtn) floatingBtn.style.display = 'flex';
    } else {
      if (phraseGroup) phraseGroup.style.display = 'none';
      if (floatingBtn) floatingBtn.style.display = 'none';
    }
  }
  
  nextStep() {
    if (!this.canProceedToNext()) {
      this.showValidationError();
      return;
    }
    
    if (this.currentStep < this.totalSteps - 1) { // 0ベースなので -1
      this.currentStep++;
      this.updateUI();
      this.scrollToTop();
      console.log(`➡️ ステップ ${this.currentStep} に移動`);
    } else {
      console.log(`⚠️ 最後のステップです (${this.currentStep}/${this.totalSteps - 1})`);
    }
  }
  
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateUI();
      this.scrollToTop();
      console.log(`⬅️ ステップ ${this.currentStep} に戻る`);
    }
  }
  
  canProceedToNext() {
    console.log(`📝 ステップ${this.currentStep}のバリデーション確認`);
    console.log(`📝 privacyAgreement: ${this.formData.privacyAgreement}`);
    
    switch (this.currentStep) {
      case 0: // 個人情報同意
        const canProceed = this.formData.privacyAgreement;
        console.log(`📝 Step 0 バリデーション結果: ${canProceed}`);
        return canProceed;
      case 1: // 基本情報
        // 現在のフォームデータ
        console.log(`📝 admissionYear: "${this.formData.admissionYear}"`);
        console.log(`📝 department: "${this.formData.department}"`);
        
        // 実際のHTML要素からも直接取得して確認
        const yearElement = document.getElementById('admission-year');
        const deptElement = document.getElementById('department');
        
        const actualYear = yearElement ? yearElement.value : '';
        const actualDept = deptElement ? deptElement.value : '';
        
        console.log(`🔍 実際の年度値: "${actualYear}"`);
        console.log(`🔍 実際の学部値: "${actualDept}"`);
        
        // 実際の値でバリデーション
        const yearValid = actualYear && actualYear.trim() !== '';
        const deptValid = actualDept && actualDept.trim() !== '';
        
        console.log(`📝 入学年度バリデーション: ${yearValid}`);
        console.log(`📝 学部バリデーション: ${deptValid}`);
        
        // フォームデータを更新（万一のため）
        if (actualYear) this.formData.admissionYear = actualYear;
        if (actualDept) this.formData.department = actualDept;
        
        const step1Valid = yearValid && deptValid;
        console.log(`📝 Step 1 最終バリデーション結果: ${step1Valid}`);
        return step1Valid;
      case 2: // 地図範囲
        return this.formData.mapType !== null;
      case 3: // 詳細エリア
        return this.formData.mapType === 'campus' || this.formData.area !== null;
      case 4: // 思い出の場所
        return this.formData.placeName.trim() !== '' && 
               this.formData.memoryContent.trim() !== '' &&
               this.formData.locationInfo.trim() !== '';
      case 5: // 確認・送信
        return this.formData.agreement;
      default:
        return true;
    }
  }
  
  showValidationError() {
    let message = '';
    
    switch (this.currentStep) {
      case 0:
        message = '個人情報の取り扱いに同意していただく必要があります';
        break;
      case 1:
        message = '入学年度と所属学部・学科は必須項目です';
        break;
      case 2:
        message = '地図の種類を選択してください';
        break;
      case 3:
        if (this.formData.mapType === 'japan') {
          message = '都道府県を選択してください';
        } else if (this.formData.mapType === 'world') {
          message = '地域を選択してください';
        }
        break;
      case 4:
        message = '場所の名前、思い出の内容、住所・座標情報は必須項目です';
        break;
      case 5:
        message = 'Webサイトへの掲載同意が必要です';
        break;
    }
    
    this.showNotification(message, 'warning');
  }
  
  updateUI() {
    this.updateProgressIndicator();
    this.updateStepVisibility();
    this.updateNavigationButtons();
    this.updateAreaSelection();
    this.updateUsefulPhraseVisibility();
    
    if (this.currentStep === 5) {
      this.updateConfirmation();
    }
  }
  
  updateProgressIndicator() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNumber = index; // 0ベースに修正
      
      step.classList.remove('active', 'completed');
      
      if (stepNumber < this.currentStep) {
        step.classList.add('completed');
      } else if (stepNumber === this.currentStep) {
        step.classList.add('active');
      }
    });
    
    document.querySelectorAll('.progress-line').forEach((line, index) => {
      const stepNumber = index; // 0ベースに修正
      line.classList.toggle('completed', stepNumber < this.currentStep);
    });
  }
  
  updateStepVisibility() {
    document.querySelectorAll('.form-step').forEach((step, index) => {
      const stepNumber = index; // 0ベースに修正
      
      if (stepNumber === this.currentStep) {
        step.classList.add('active');
        step.style.display = 'block';
        // Trigger animation
        setTimeout(() => {
          step.style.opacity = '1';
          step.style.transform = 'translateY(0)';
        }, 50);
      } else {
        step.classList.remove('active');
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        setTimeout(() => {
          if (!step.classList.contains('active')) {
            step.style.display = 'none';
          }
        }, 300);
      }
    });
  }
  
  updateAreaSelection() {
    if (this.currentStep === 3) {
      const japanArea = document.getElementById('japan-area');
      const worldArea = document.getElementById('world-area');
      
      if (this.formData.mapType === 'japan') {
        if (japanArea) japanArea.style.display = 'block';
        if (worldArea) worldArea.style.display = 'none';
      } else if (this.formData.mapType === 'world') {
        if (japanArea) japanArea.style.display = 'none';
        if (worldArea) worldArea.style.display = 'block';
      } else {
        if (japanArea) japanArea.style.display = 'none';
        if (worldArea) worldArea.style.display = 'none';
      }
    }
  }
  
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Previous button
    if (prevBtn) {
      prevBtn.style.display = this.currentStep > 0 ? 'flex' : 'none'; // 0ベースに修正
    }
    
    // Next/Submit buttons
    if (this.currentStep < this.totalSteps - 1) {
      // Show next button
      if (nextBtn) {
        nextBtn.style.display = 'flex';
        nextBtn.disabled = !this.canProceedToNext();
      }
      if (submitBtn) submitBtn.style.display = 'none';
    } else {
      // Show submit button
      if (nextBtn) nextBtn.style.display = 'none';
      if (submitBtn) {
        submitBtn.style.display = 'flex';
        submitBtn.disabled = !this.canProceedToNext();
      }
    }
  }
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  updateConfirmation() {
    const mapTypeNames = {
      'campus': 'キャンパス周辺',
      'japan': '日本全国',
      'world': '全世界'
    };
    
    // 基本情報
    document.getElementById('confirm-name').textContent = 
      this.formData.name || '匿名';
    
    document.getElementById('confirm-admission-year').textContent = 
      this.formData.admissionYear ? `${this.formData.admissionYear}年度` : '-';
    
    document.getElementById('confirm-department').textContent = 
      this.formData.department || '-';
    
    // 場所情報
    document.getElementById('confirm-map-type').textContent = 
      mapTypeNames[this.formData.mapType] || '-';
    
    document.getElementById('confirm-area').textContent = 
      this.formData.area || (this.formData.mapType === 'campus' ? 'キャンパス周辺' : '-');
    
    // 思い出の場所
    document.getElementById('confirm-place-name').textContent = 
      this.formData.placeName || '-';
    
    document.getElementById('confirm-memory-content').textContent = 
      this.formData.memoryContent || '-';
    
    document.getElementById('confirm-location-info').textContent = 
      this.formData.locationInfo || '-';
    
    // 写真
    const photoInfo = this.getPhotoInfo();
    document.getElementById('confirm-photo').textContent = photoInfo;
    
    // 役立つフレーズ（海外の場合のみ）
    const phraseSection = document.getElementById('confirm-phrase-section');
    if (this.formData.mapType === 'world') {
      if (phraseSection) phraseSection.style.display = 'block';
      document.getElementById('confirm-useful-phrase').textContent = 
        this.formData.usefulPhrase || '未入力';
    } else {
      if (phraseSection) phraseSection.style.display = 'none';
    }
  }
  
  getPhotoInfo() {
    if (this.formData.photoType === 'file' && this.formData.photoFile) {
      return `${this.formData.photoFile.name} (${(this.formData.photoFile.size / 1024 / 1024).toFixed(2)}MB)`;
    } else if (this.formData.photoType === 'url' && this.formData.photoUrl) {
      return this.formData.photoUrl;
    }
    return '未添付';
  }
  
  async submitForm() {
    if (!this.validateFormData()) {
      this.showNotification('入力内容に不備があります', 'error');
      return;
    }
    
    this.showLoadingOverlay(true);
    
    try {
      // Google Forms連携は google-forms.js で処理
      if (window.GoogleFormsHandler) {
        await window.GoogleFormsHandler.submitToGoogleForms(this.formData);
      } else {
        // フォールバック: ログ出力
        console.log('📤 送信データ:', this.formData);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 送信シミュレーション
      }
      
      this.showSuccessMessage();
      
    } catch (error) {
      console.error('❌ 送信エラー:', error);
      this.showNotification('送信に失敗しました。もう一度お試しください。', 'error');
    } finally {
      this.showLoadingOverlay(false);
    }
  }
  
  validateFormData() {
    return this.formData.privacyAgreement &&
           this.formData.admissionYear &&
           this.formData.department.trim() !== '' &&
           this.formData.mapType && 
           (this.formData.mapType === 'campus' || this.formData.area) &&
           this.formData.placeName.trim() !== '' &&
           this.formData.memoryContent.trim() !== '' &&
           this.formData.locationInfo.trim() !== '' &&
           this.formData.agreement;
  }
  
  showSuccessMessage() {
    // 成功ページを表示
    const main = document.querySelector('.main .container');
    if (main) {
      main.innerHTML = `
        <div class="success-container" style="text-align: center; max-width: 600px; margin: 0 auto; padding: 3rem 0;">
          <div style="font-size: 4rem; color: var(--primary-color); margin-bottom: 2rem;">✅</div>
          <h2 style="color: var(--text-dark); margin-bottom: 1rem; font-size: 2rem;">送信完了しました！</h2>
          <p style="color: var(--text-medium); font-size: 1.1rem; margin-bottom: 2rem;">
            プレースマークの投稿ありがとうございました。<br>
            内容を確認後、FGSSmapに追加させていただきます。
          </p>
          <div style="background: var(--bg-card); padding: 2rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid var(--border-light);">
            <h3 style="color: var(--text-dark); margin-bottom: 1rem;">投稿内容</h3>
            <div style="text-align: left;">
              <p><strong>投稿者:</strong> ${this.formData.name || '匿名'} (${this.formData.admissionYear}年度)</p>
              <p><strong>所属:</strong> ${this.formData.department}</p>
              <p><strong>地図:</strong> ${this.getMapTypeName()}</p>
              <p><strong>エリア:</strong> ${this.formData.area || 'キャンパス周辺'}</p>
              <p><strong>場所:</strong> ${this.formData.placeName}</p>
            </div>
          </div>
          <button onclick="location.reload()" style="background: var(--primary-color); color: white; border: none; padding: 1rem 2rem; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">
            新しい投稿をする
          </button>
        </div>
      `;
    }
  }
  
  getMapTypeName() {
    const names = {
      'campus': 'キャンパス周辺',
      'japan': '日本全国',
      'world': '全世界'
    };
    return names[this.formData.mapType] || this.formData.mapType;
  }
  
  showLoadingOverlay(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.toggle('show', show);
    }
  }
  
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
    
    // Show animation
    setTimeout(() => notification.classList.add('show'), 10);
  }
}

// ===================================
// Initialize Form Step Manager
// ===================================

// Global instance
window.formStepManager = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.formStepManager = new FormStepManager();
  
  console.log('🚀 フォームステップマネージャー開始');
});
