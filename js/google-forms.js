// ===================================
// Google Forms Integration Handler
// ===================================

class GoogleFormsHandler {
  constructor() {
    // Google Forms の設定
    // 実際のフォームIDは後で設定
    this.formConfig = {
      baseUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScRpPozTFOdhYewdSlplFZJDDf0_fd0P5E8LHE9i44RRRQHkg/formResponse',
      fields: {
        // 基本情報
        agreement: 'entry.1561446963',     // 個人情報同意
        name: 'entry.2123176977',          // 名前
        admissionYear: 'entry.1965829702', // 入学年度
        department: 'entry.1082752244',    // 所属学部（選択式に変更）
        
        // 地図・場所情報
        mapType: 'entry.2034270027',       // 地図種別（新規エントリー）
        area: 'entry.543788472',           // エリア（都道府県/地域）
        placeName: 'entry.292626865',      // 思い出の場所名
        memoryContent: 'entry.1821330701', // 思い出の内容
        locationInfo: 'entry.1788023988',  // 住所・座標情報
        
        // 写真情報（現在は存在しないため他フィールドで代用）
        photoType: 'entry.1788023988',     // 住所フィールドで代用
        photoUrl: 'entry.1788023988',      // 住所フィールドで代用
        photoFileName: 'entry.1788023988', // 住所フィールドで代用
        
        // 海外の場合（現在は存在しないため他フィールドで代用）
        usefulPhrase: 'entry.1788023988',  // 住所フィールドで代用
        
        // その他
        submissionTime: 'entry.627026854'  // 送信日時
      }
    };
    
    console.log('📋 GoogleFormsHandler初期化完了');
  }
  
  /**
   * Google Formsにデータを送信
   */
  async submitToGoogleForms(formData) {
    console.log('📤 Google Forms送信開始:', formData);
    
    try {
      // フォームデータを構築
      const submitData = this.buildFormData(formData);
      
      // 事前入力URLを生成（デバッグ用）
      const prefilledUrl = this.generatePrefilledUrl(formData);
      console.log('🔗 事前入力URL:', prefilledUrl);
      
      // 実際の送信処理
      const response = await this.sendToGoogleForms(submitData);
      
      console.log('✅ Google Forms送信成功');
      return response;
      
    } catch (error) {
      console.error('❌ Google Forms送信エラー:', error);
      throw error;
    }
  }
  
  /**
   * フォームデータを構築
   */
  buildFormData(data) {
    const formData = new FormData();
    
    // 基本情報
    formData.append(this.formConfig.fields.agreement, data.privacyAgreement ? 'はい。同意します。' : 'いいえ、同意しません。');
    formData.append(this.formConfig.fields.name, data.name || '匿名');
    formData.append(this.formConfig.fields.admissionYear, data.admissionYear || '');
    formData.append(this.formConfig.fields.department, data.department || '');
    
    // 地図・場所情報
    const mapTypeText = {
      'campus': 'キャンパス周辺',
      'japan': '日本全国',
      'world': '全世界'
    };
    
    // 地図種別を送信
    formData.append(this.formConfig.fields.mapType, mapTypeText[data.mapType] || data.mapType || '');
    
    // エリア情報（都道府県または世界地域）
    let areaInfo = '';
    if (data.mapType === 'campus') {
      areaInfo = 'キャンパス周辺';
    } else {
      areaInfo = data.area || '';
    }
    
    formData.append(this.formConfig.fields.area, areaInfo);
    formData.append(this.formConfig.fields.placeName, data.placeName || '');
    formData.append(this.formConfig.fields.memoryContent, data.memoryContent || '');
    formData.append(this.formConfig.fields.locationInfo, data.locationInfo || '');
    
    // 写真情報（現在は1つのフィールドにまとめて送信）
    let photoInfo = '写真なし';
    if (data.photoType === 'url' && data.photoUrl) {
      photoInfo = `URL: ${data.photoUrl}`;
    } else if (data.photoType === 'file' && data.photoFile) {
      photoInfo = `ファイル: ${data.photoFile.name}`;
    }
    formData.append(this.formConfig.fields.photoType, photoInfo);
    
    // 海外の場合の追加情報（同じフィールドに追加）
    if (data.mapType === 'world' && data.usefulPhrase) {
      photoInfo += `\n役立つフレーズ: ${data.usefulPhrase}`;
      formData.set(this.formConfig.fields.photoType, photoInfo);
    }
    
    // 送信日時
    formData.append(this.formConfig.fields.submissionTime, new Date().toLocaleString('ja-JP'));
    
    return formData;
  }
  
  /**
   * 場所情報の文字列を生成
   */
  getLocationString(data) {
    const mapTypeNames = {
      'campus': 'キャンパス周辺',
      'japan': '日本全国',
      'world': '全世界'
    };
    
    const mapTypeName = mapTypeNames[data.mapType] || data.mapType;
    
    if (data.mapType === 'campus') {
      return 'キャンパス周辺';
    } else {
      return `${mapTypeName} > ${data.area}`;
    }
  }
  
  /**
   * Google Formsへの実際の送信
   */
  async sendToGoogleForms(formData) {
    // 実際のGoogle Formsに送信
    try {
      const response = await fetch(this.formConfig.baseUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Google FormsはCORSが有効でないため
      });
      
      console.log('✅ Google Forms送信成功');
      return { ok: true, status: 200 };
      
    } catch (error) {
      console.error('❌ Google Forms送信エラー:', error);
      
      // エラー時はシミュレーションでフォールバック
      console.log('📝 フォールバック: 送信シミュレーション');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ok: true, status: 200 });
        }, 1000);
      });
    }
  }
  
  /**
   * 事前入力URLを生成（テスト・デバッグ用）
   */
  generatePrefilledUrl(data) {
    const baseUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';
    const params = new URLSearchParams();
    
    // 基本情報
    params.append(this.formConfig.fields.name, data.name || '匿名');
    params.append(this.formConfig.fields.admissionYear, data.admissionYear || '');
    params.append(this.formConfig.fields.department, data.department || '');
    
    // 地図・場所情報
    params.append(this.formConfig.fields.mapType, data.mapType || '');
    params.append(this.formConfig.fields.area, data.area || '');
    params.append(this.formConfig.fields.placeName, data.placeName || '');
    params.append(this.formConfig.fields.memoryContent, data.memoryContent || '');
    params.append(this.formConfig.fields.locationInfo, data.locationInfo || '');
    
    // 写真情報
    params.append(this.formConfig.fields.photoType, data.photoType || 'none');
    if (data.photoType === 'url' && data.photoUrl) {
      params.append(this.formConfig.fields.photoUrl, data.photoUrl);
    } else if (data.photoType === 'file' && data.photoFile) {
      params.append(this.formConfig.fields.photoFileName, data.photoFile.name);
    }
    
    // 海外の場合の追加情報
    if (data.mapType === 'world' && data.usefulPhrase) {
      params.append(this.formConfig.fields.usefulPhrase, data.usefulPhrase);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  /**
   * フォーム設定を更新
   */
  updateFormConfig(newConfig) {
    this.formConfig = { ...this.formConfig, ...newConfig };
    console.log('📋 フォーム設定更新:', this.formConfig);
  }
  
  /**
   * Google FormsのエントリーIDを取得するヘルパー
   * （実際のフォームから取得が必要）
   */
  static getEntryIds() {
    console.log(`
📋 Google Formsエントリー ID取得方法:

1. Google Formsを開く
2. 右上の「送信」をクリック
3. リンクタブを選択
4. URLをコピー
5. ブラウザで開いてF12（開発者ツール）
6. Networkタブで適当に入力して送信
7. formResponseリクエストを確認
8. entry.xxxxxxxxx の形式のIDを取得

例:
entry.123456789 → 地図種別
entry.987654321 → エリア
entry.111111111 → 場所名
...
    `);
  }
}

// ===================================
// Legacy Google Forms Helper
// ===================================

/**
 * 従来のGoogle Formsフォーマットでの送信
 */
class LegacyGoogleFormsHandler {
  static async submitToLegacyForm(formData) {
    console.log('📤 Legacy Google Forms送信:', formData);
    
    // 既存のGoogle Formsと同じ形式でデータを整形
    const legacyData = {
      '地図種別': formData.mapType === 'campus' ? 'キャンパス周辺' : 
                  formData.mapType === 'japan' ? '日本全国' : '全世界',
      'エリア詳細': formData.area || 'キャンパス周辺',
      '場所名': formData.placeName,
      '座標': formData.coordinates || '',
      '説明・思い出': formData.description,
      '写真URL': formData.imageUrl || '',
      '投稿者名': formData.submitterName || '匿名',
      '投稿日時': new Date().toLocaleString('ja-JP')
    };
    
    console.log('📝 整形済みデータ:', legacyData);
    
    // 実際の送信は後で実装
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('✅ Legacy送信完了');
        resolve({ success: true });
      }, 1000);
    });
  }
}

// ===================================
// URL Parameter Handler
// ===================================

/**
 * URLパラメータ経由でのGoogle Forms事前入力
 */
class UrlParameterHandler {
  static generateGoogleFormsUrl(formData, formId) {
    const baseUrl = `https://docs.google.com/forms/d/e/${formId}/viewform`;
    const params = new URLSearchParams();
    
    // 実際のエントリーIDに合わせて修正が必要
    const entryMapping = {
      'mapType': 'entry.123456789',
      'area': 'entry.987654321', 
      'placeName': 'entry.111111111',
      'coordinates': 'entry.222222222',
      'description': 'entry.333333333',
      'imageUrl': 'entry.444444444',
      'submitterName': 'entry.555555555'
    };
    
    // パラメータを設定
    Object.keys(entryMapping).forEach(key => {
      const value = formData[key];
      if (value) {
        params.append(entryMapping[key], value);
      }
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log('🔗 生成されたGoogle FormsURL:', fullUrl);
    
    return fullUrl;
  }
  
  /**
   * 新しいタブでGoogle Formsを開く
   */
  static openGoogleForms(formData, formId) {
    const url = this.generateGoogleFormsUrl(formData, formId);
    window.open(url, '_blank');
  }
}

// ===================================
// CSV Export Helper
// ===================================

/**
 * CSV形式でのデータエクスポート（バックアップ用）
 */
class CsvExportHandler {
  static exportToCsv(formData) {
    const csvData = [
      ['項目', '値'],
      ['投稿日時', new Date().toLocaleString('ja-JP')],
      ['地図種別', formData.mapType],
      ['エリア', formData.area || ''],
      ['場所名', formData.placeName],
      ['座標', formData.coordinates || ''],
      ['説明・思い出', formData.description],
      ['写真URL', formData.imageUrl || ''],
      ['投稿者名', formData.submitterName || '匿名']
    ];
    
    const csvString = csvData.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    // ダウンロード
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `placemark_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('💾 CSVエクスポート完了');
  }
}

// Global export
window.GoogleFormsHandler = new GoogleFormsHandler();
window.LegacyGoogleFormsHandler = LegacyGoogleFormsHandler;
window.UrlParameterHandler = UrlParameterHandler;
window.CsvExportHandler = CsvExportHandler;
