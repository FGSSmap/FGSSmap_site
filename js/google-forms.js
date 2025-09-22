// ===================================
// Google Forms Integration Handler
// ===================================

class GoogleFormsHandler {
  constructor() {
    // Google Forms の設定
    // 実際のフォームIDは後で設定
    this.formConfig = {
      baseUrl: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse',
      fields: {
        // 基本情報
        name: 'entry.111111111',           // 名前
        admissionYear: 'entry.222222222',  // 入学年度
        department: 'entry.333333333',     // 所属学部・学科
        
        // 地図・場所情報
        mapType: 'entry.444444444',        // 地図種別（campus/japan/world）
        area: 'entry.555555555',           // エリア（都道府県/地域）
        placeName: 'entry.666666666',      // 思い出の場所名
        memoryContent: 'entry.777777777',  // 思い出の内容
        locationInfo: 'entry.888888888',   // 住所・座標情報
        
        // 写真情報
        photoType: 'entry.999999999',      // 写真タイプ（file/url）
        photoUrl: 'entry.101010101',       // 写真URL（URLタイプの場合）
        photoFileName: 'entry.121212121',  // 写真ファイル名（fileタイプの場合）
        
        // 海外の場合
        usefulPhrase: 'entry.131313131',   // 役立つフレーズ
        
        // その他
        submissionTime: 'entry.141414141'  // 送信日時
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
    formData.append(this.formConfig.fields.name, data.name || '匿名');
    formData.append(this.formConfig.fields.admissionYear, data.admissionYear || '');
    formData.append(this.formConfig.fields.department, data.department || '');
    
    // 地図・場所情報
    formData.append(this.formConfig.fields.mapType, data.mapType || '');
    formData.append(this.formConfig.fields.area, data.area || '');
    formData.append(this.formConfig.fields.placeName, data.placeName || '');
    formData.append(this.formConfig.fields.memoryContent, data.memoryContent || '');
    formData.append(this.formConfig.fields.locationInfo, data.locationInfo || '');
    
    // 写真情報
    formData.append(this.formConfig.fields.photoType, data.photoType || 'none');
    if (data.photoType === 'url' && data.photoUrl) {
      formData.append(this.formConfig.fields.photoUrl, data.photoUrl);
    } else if (data.photoType === 'file' && data.photoFile) {
      formData.append(this.formConfig.fields.photoFileName, data.photoFile.name);
      // 実際のファイルアップロードは別途処理が必要
    }
    
    // 海外の場合の追加情報
    if (data.mapType === 'world' && data.usefulPhrase) {
      formData.append(this.formConfig.fields.usefulPhrase, data.usefulPhrase);
    }
    
    // 送信日時
    formData.append(this.formConfig.fields.submissionTime, new Date().toISOString());
    
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
    // 現在は開発版なので、実際のGoogle Formsへの送信はコメントアウト
    // 実際の運用時は以下のコメントを外す
    
    /*
    const response = await fetch(this.formConfig.baseUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Google FormsはCORSが有効でないため
    });
    
    return response;
    */
    
    // 開発版: 送信をシミュレーション
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('📝 送信シミュレーション完了');
        resolve({ ok: true, status: 200 });
      }, 1500);
    });
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
