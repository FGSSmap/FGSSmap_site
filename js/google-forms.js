// ===================================
// Google Forms Integration Handler (Fixed)
// ===================================

class GoogleFormsHandler {
  constructor() {
    // 本家Google FormsのフォームID
    this.formId = '1FAIpQLScRpPozTFOdhYewdSlplFZJDDf0_fd0P5E8LHE9i44RRRQHkg';
    
    // 最新のフラット化されたフォームのエントリーID
    this.entryIds = {
      agreement: 'entry.1561446963',       // プライバシー同意
      name: 'entry.1015364381',            // 名前
      admissionYear: 'entry.938598983',    // 入学年度
      department: 'entry.1399231733',      // 所属学部
      mapType: 'entry.2034270027',         // 地図の種類
      prefectureArea: 'entry.543788472',   // 都道府県（日本選択時）
      worldArea: 'entry.1787451133',       // 世界地域（世界選択時）
      placeName: 'entry.292626865',        // 思い出の場所名
      memoryContent: 'entry.1821330701',   // 思い出の内容
      locationInfo: 'entry.1788023988',    // 住所・座標情報
      usefulPhrase: 'entry.2027696795',    // 役立つフレーズ
      submissionTime: 'entry.627026854'    // 日付
    };
    
    console.log('📋 GoogleFormsHandler初期化完了（修正版）');
  }
  
  async submitToGoogleForms(formData) {
    console.log('📤 Google Forms送信開始:', formData);
    
    try {
      // FormDataを作成 (test.htmlと同じ方式)
      const submitData = new FormData();
      
      // 基本情報
      const agreementValue = formData.privacyAgreement ? 'はい。同意します。' : 'いいえ';
      const nameValue = formData.name || '';
      const yearValue = formData.admissionYear ? `${formData.admissionYear}年度` : '';
      const deptValue = formData.department || '';
      
      console.log('📝 送信データ準備:');
      console.log('  同意:', agreementValue);
      console.log('  名前:', nameValue);
      console.log('  年度:', yearValue);
      console.log('  学部:', deptValue);
      
      // test.htmlと同じ方式でFormDataに追加
      submitData.append(this.entryIds.agreement, agreementValue);
      submitData.append(this.entryIds.name, nameValue);
      submitData.append(this.entryIds.admissionYear, yearValue);
      submitData.append(this.entryIds.department, deptValue);
      
      // 地図・場所情報
      const mapTypeText = {
        'campus': 'キャンパス周辺',
        'japan': '日本全国', 
        'world': '全世界'
      };
      submitData.append(this.entryIds.mapType, mapTypeText[formData.mapType] || '');
      
      // エリア情報（条件に応じて適切なフィールドに送信）
      if (formData.mapType === 'japan') {
        submitData.append(this.entryIds.prefectureArea, formData.area || '');
        submitData.append(this.entryIds.worldArea, '');
      } else if (formData.mapType === 'world') {
        submitData.append(this.entryIds.prefectureArea, '');
        submitData.append(this.entryIds.worldArea, formData.area || '');
      } else {
        submitData.append(this.entryIds.prefectureArea, '');
        submitData.append(this.entryIds.worldArea, '');
      }
      
      // 場所情報
      submitData.append(this.entryIds.placeName, formData.placeName || '');
      submitData.append(this.entryIds.memoryContent, formData.memoryContent || '');
      submitData.append(this.entryIds.locationInfo, formData.locationInfo || '');
      
      // 役立つフレーズ（海外選択時のみ）
      submitData.append(this.entryIds.usefulPhrase, 
        (formData.mapType === 'world' && formData.usefulPhrase) ? formData.usefulPhrase : '');
      
      // 送信日時
      submitData.append(this.entryIds.submissionTime, new Date().toLocaleString('ja-JP'));
      
      // Google Formsに送信 (test.htmlと全く同じ方式)
      const submitUrl = `https://docs.google.com/forms/d/e/${this.formId}/formResponse`;
      console.log(`📡 送信URL: ${submitUrl}`);
      
      await fetch(submitUrl, {
        method: 'POST',
        body: submitData,
        mode: 'no-cors'
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

// グローバルインスタンスを作成
window.GoogleFormsHandler = new GoogleFormsHandler();
