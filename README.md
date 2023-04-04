# wallet-manager

URL https://wallet-manager.net

## 概要

**「wallet-manager」**

- 月の支出を入力し、リスト化することができます。
- 会計を共有するメンバーを登録することができます。
- メンバーが立て替えた支出、個人的な支出を区別して表示することができます。

## なぜこのアプリを作ったか
### 背景
私の家庭では、夫婦の共同生活費を管理するため、専用の銀行口座を開設し、口座に紐づけたクレジットカードで買い物を行っています。
また、それぞれ毎月の負担額を決めて、その口座に入金しています。
すべての支出が当該カードを通じてされるわけではなく、
- 家賃水道光熱費など、カード決済できなかったり、別の口座から支出しなければならなかったりする場合
- 自分用の物（おやつなど）と共有の物（夕飯の食材）をまとめて買いたいときに、共用物の代金を個人の財布から立て替えたり、共用カードで私物の代金を立て替えたりする場合

などといった例外的な場合もあり、それらを都度記録し、月末に（毎月の負担額＋個人的な買い物額－立て替えて支払った額）を計算して口座に入金する必要があります。
以前はカード利用明細確認用スマホアプリの家計簿機能を使っていましたが、カードを通じた支出の分析には優れている一方、カード以外からの支出を記録する場合に手間がかかること、
カードからの支出とカード以外での支出が混ざってしまい、利用明細アプリとして使いづらくなってしまうこと、精算金額の計算までは当然行ってくれないこと、という悩みがありました。

既婚の友人たちにもこの話をすると、共感してもらえることも多かったため、これらの悩みを解決する、家計簿作成と精算ができるシンプルなアプリを作ろうと考えました。

### 活用方法
**①ユーザー登録**

ユーザー名、メールアドレス、パスワードを登録することで利用できます。

**②メンバー登録**

メンバー名、毎月の基本支払い額を登録できます

例えば、夫婦二人暮らしで、生活費の負担額が夫→80,000円/月、妻→70,000円/月の場合、図のように登録します。

**③支出リスト**

日付、項目、内容、金額、支出した人の名前、立て替えたかどうか、を登録できます。入力中に電卓を使って計算することもできます。

また、支出した人の名前欄は、登録したメンバーから選択できるようになっています。

個人的な買い物を共通会計でした場合は「名前」にメンバー名を入力して「立て替え」を「－」、共用のものを誰かが立て替えたときは、メンバー名を入力して「立て替え」を「○」、
共通会計でそのまま買い物した場合は「名前」で「共通会計」を選択して「立て替え」を「－」としてください。

**④メンバーごとの精算**

「毎月の負担額＋個人の支出額－立て替えて支払った額」の計算結果と、個人の支出リスト、立て替えたものリストが表示されます。

### 家計簿以外の活用例
（例）複数人で旅行に行った際、宿泊代、交通費、食事代を誰かが立て替えて、後日精算するとき

1. メンバー名のみ登録
2. 支出リスト作成
3. 合計金額を割り勘して負担額を算出し、メンバーごとに登録
4. 精算額ページを確認

## AWSネットワーク構成図
## ER図
## 使用技術
- HTML/CSS
- javascript
- Node.js 18
- MySQL 8.0
- express
- express-session
- bcryptjs
- AWS (EC2, RDS for MySQL, S3, VPC, Route53, ALB, ACM)
- Apache
- VS CODE

## 機能一覧
- ログイン/ログアウト ユーザー登録
- 支出リスト表示
- 支出項目の新規登録、編集、削除
- 電卓機能
- 当月、先月の支出の合計
- メンバーの新規登録、編集、削除
- メンバーリスト表示
- メンバー毎の支出金額の計算、表示
- 3ヶ月以上前のデータの一括削除
- レスポンシブ対応
