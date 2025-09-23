// ===================================
// Google Forms Integration Handler (Simplified)
// ===================================

class GoogleFormsHandler {
  constructor() {
    // 本家Google FormsのエントリーID（画像機能除く）
    this.formId = '1FAIpQLScRpPozTFOdhYewdSlplFZJDDf0_fd0P5E8LHE9i44RRRQHkg';
    this.entryIds = {
      agreement: 'entry.1561446963',       // プライバシー同意
      name: 'entry.2123176977',            // 名前
      admissionYear: 'entry.1965829702',   // 入学年度
      department: 'entry.1082752244',      // 所属学部
      mapType: 'entry.2034270027',         // 地図の種類
      prefectureArea: 'entry.543788472',   // 都道府県エリア（日本国内用）
      worldArea: 'entry.1787451133',       // 世界エリア（海外用）
      placeName: 'entry.292626865',        // 思い出の場所名
      memoryContent: 'entry.1821330701',   // 思い出の内容
      locationInfo: 'entry.1788023988',    // 住所・座標情報
      usefulPhrase: 'entry.2027696795',    // 役立つフレーズ
      submissionTime: 'entry.627026854'    // 日付
    };
    
    console.log('📋 GoogleFormsHandler初期化完了');
  }
  
  async submitToGoogleForms(formData) {
    console.log('📤 Google Forms送信開始:', formData);
    
    try {
      // FormDataを作成
      const submitData = new FormData();
      
      // 基本情報
      submitData.append(this.entryIds.agreement, formData.privacyAgreement ? 'はい。同意します。' : 'いいえ');
      submitData.append(this.entryIds.name, formData.name || '匿名');
      submitData.append(this.entryIds.admissionYear, formData.admissionYear ? `${formData.admissionYear}年度` : '');
      submitData.append(this.entryIds.department, formData.department || '');
      
      // 地図・場所情報
      const mapTypeText = {
        'campus': 'キャンパス周辺',
        'japan': '日本全国',
        'world': '全世界'
      };
      submitData.append(this.entryIds.mapType, mapTypeText[formData.mapType] || '');
      
      // エリア情報（日本国内用と海外用を分けて送信）
      if (formData.mapType === 'japan' && formData.area) {
        submitData.append(this.entryIds.prefectureArea, formData.area);
        submitData.append(this.entryIds.worldArea, ''); // 空で送信
      } else if (formData.mapType === 'world' && formData.area) {
        submitData.append(this.entryIds.prefectureArea, ''); // 空で送信
        submitData.append(this.entryIds.worldArea, formData.area);
      } else {
        // キャンパス周辺の場合
        submitData.append(this.entryIds.prefectureArea, 'キャンパス周辺');
        submitData.append(this.entryIds.worldArea, '');
      }
      
      submitData.append(this.entryIds.placeName, formData.placeName || '');
      submitData.append(this.entryIds.memoryContent, formData.memoryContent || '');
      
      // 住所・座標情報
      submitData.append(this.entryIds.locationInfo, formData.locationInfo || '');
      
      // 役立つフレーズ（海外の場合のみ）
      if (formData.mapType === 'world' && formData.usefulPhrase) {
        submitData.append(this.entryIds.usefulPhrase, formData.usefulPhrase);
      } else {
        submitData.append(this.entryIds.usefulPhrase, '');
      }
      submitData.append(this.entryIds.submissionTime, new Date().toLocaleString('ja-JP'));
      
      // 事前入力URL生成（確認用）
      const prefilledUrl = this.generatePrefilledUrl(formData);
      console.log('🔗 事前入力URL:', prefilledUrl);
      
      // Google Formsに送信
      const submitUrl = `https://docs.google.com/forms/d/e/${this.formId}/formResponse`;
      
      const response = await fetch(submitUrl, {
        method: 'POST',
        body: submitData,
        mode: 'no-cors' // CORSエラーを回避
      });
      
      console.log('✅ Google Forms送信成功');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Google Forms送信エラー:', error);
      throw error;
    }
  }
  
  // 事前入力URLを生成（確認用）
  generatePrefilledUrl(formData) {
    const baseUrl = `https://docs.google.com/forms/d/e/${this.formId}/viewform`;
    const params = new URLSearchParams();
    
    // 基本情報
    if (formData.name) params.append(this.entryIds.name, formData.name);
    if (formData.admissionYear) params.append(this.entryIds.admissionYear, `${formData.admissionYear}年度`);
    if (formData.department) params.append(this.entryIds.department, formData.department);
    
    // 地図・場所情報
    const mapTypeText = {
      'campus': 'キャンパス周辺',
      'japan': '日本全国',
      'world': '全世界'
    };
    if (formData.mapType) params.append(this.entryIds.mapType, mapTypeText[formData.mapType]);
    
    // エリア情報（日本国内用と海外用）
    if (formData.mapType === 'japan' && formData.area) {
      params.append(this.entryIds.prefectureArea, formData.area);
    } else if (formData.mapType === 'world' && formData.area) {
      params.append(this.entryIds.worldArea, formData.area);
    }
    
    if (formData.placeName) params.append(this.entryIds.placeName, formData.placeName);
    if (formData.memoryContent) params.append(this.entryIds.memoryContent, formData.memoryContent);
    if (formData.locationInfo) params.append(this.entryIds.locationInfo, formData.locationInfo);
    if (formData.usefulPhrase) params.append(this.entryIds.usefulPhrase, formData.usefulPhrase);
    
    const url = `${baseUrl}?${params.toString()}`;
    return url;
  }
}

// グローバルインスタンスを作成（成功実績のあるGoogle Forms）
window.GoogleFormsHandler = new GoogleFormsHandler();
