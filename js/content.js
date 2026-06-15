// AmaarBazaar — static info-page content (bilingual). Rendered by initInfoPage() in app.js.
// Keyed by the ?p= slug used in footer links (info.html?p=about, etc.).
const SITE_CONTENT = {
  about: {
    title: { en: 'About us', bn: 'আমাদের সম্পর্কে' },
    html: {
      en: `
        <p class="lead">AmaarBazaar is Bangladesh's free local marketplace — a simple, trusted place to buy and sell almost anything, from your neighbourhood to all 64 districts.</p>
        <h2>Our mission</h2>
        <p>We believe everyone in Bangladesh should be able to trade safely and for free. Whether you're selling a phone in Dhaka, renting a flat in Sylhet, or finding work in Chattogram, AmaarBazaar connects you with real people nearby — in Bangla and English.</p>
        <h2>What you can do</h2>
        <ul>
          <li><strong>Post an ad in minutes</strong> — add photos, a description and a price in Taka. It's free.</li>
          <li><strong>Reach local buyers</strong> — your listing is seen by buyers across your city and beyond.</li>
          <li><strong>Pay securely</strong> — boost your ad with bKash, Nagad, Rocket or card.</li>
          <li><strong>Stay safe</strong> — verified sellers, in-app contact and clear safety guidance.</li>
        </ul>
        <h2>AmaarBazaar by the numbers</h2>
        <div class="info-stats">
          <div><b>600K+</b><span>Active users daily</span></div>
          <div><b>30K+</b><span>New ads daily</span></div>
          <div><b>64</b><span>Districts covered</span></div>
        </div>
        <p>Have an idea or feedback? We'd love to hear from you — visit our <a href="info.html?p=contact">Contact</a> page.</p>`,
      bn: `
        <p class="lead">আমারবাজার বাংলাদেশের একটি ফ্রি স্থানীয় বাজার — প্রায় যেকোনো কিছু কেনা-বেচার সহজ ও বিশ্বস্ত জায়গা, আপনার এলাকা থেকে সারা ৬৪ জেলা পর্যন্ত।</p>
        <h2>আমাদের লক্ষ্য</h2>
        <p>আমরা বিশ্বাস করি বাংলাদেশের প্রত্যেকে নিরাপদে ও বিনামূল্যে কেনাবেচা করতে পারবেন। ঢাকায় ফোন বিক্রি, সিলেটে ফ্ল্যাট ভাড়া কিংবা চট্টগ্রামে কাজ খোঁজা — আমারবাজার আপনাকে কাছের মানুষের সাথে যুক্ত করে, বাংলা ও ইংরেজিতে।</p>
        <h2>আপনি যা করতে পারেন</h2>
        <ul>
          <li><strong>কয়েক মিনিটেই বিজ্ঞাপন দিন</strong> — ছবি, বর্ণনা ও টাকায় দাম যোগ করুন। সম্পূর্ণ ফ্রি।</li>
          <li><strong>স্থানীয় ক্রেতার কাছে পৌঁছান</strong> — আপনার বিজ্ঞাপন শহরজুড়ে ক্রেতারা দেখেন।</li>
          <li><strong>নিরাপদে পেমেন্ট</strong> — বিকাশ, নগদ, রকেট বা কার্ডে বিজ্ঞাপন বুস্ট করুন।</li>
          <li><strong>নিরাপদ থাকুন</strong> — যাচাইকৃত বিক্রেতা ও স্পষ্ট নিরাপত্তা নির্দেশনা।</li>
        </ul>
        <h2>সংখ্যায় আমারবাজার</h2>
        <div class="info-stats">
          <div><b>৬ লক্ষ+</b><span>দৈনিক সক্রিয় ব্যবহারকারী</span></div>
          <div><b>৩০ হাজার+</b><span>দৈনিক নতুন বিজ্ঞাপন</span></div>
          <div><b>৬৪</b><span>জেলা জুড়ে</span></div>
        </div>
        <p>পরামর্শ আছে? আমাদের <a href="info.html?p=contact">যোগাযোগ</a> পেজে জানান।</p>`
    }
  },
  careers: {
    title: { en: 'Careers', bn: 'ক্যারিয়ার' },
    html: {
      en: `
        <p class="lead">Help us build Bangladesh's most trusted marketplace. We're a small, fast-moving team that cares about real impact for local buyers and sellers.</p>
        <h2>Open roles</h2>
        <div class="info-cards">
          <div class="info-card"><h3>Frontend Engineer</h3><p>Dhaka · Full-time</p><p>Build fast, accessible web experiences used by hundreds of thousands of people daily.</p></div>
          <div class="info-card"><h3>Community &amp; Trust Lead</h3><p>Dhaka · Full-time</p><p>Keep the marketplace safe — shape our verification, moderation and safety programmes.</p></div>
          <div class="info-card"><h3>Growth Marketer</h3><p>Remote · Full-time</p><p>Grow our buyer and seller base across all 64 districts.</p></div>
        </div>
        <h2>How to apply</h2>
        <p>Send your CV and a short note about why you'd like to join to <a href="mailto:careers@amaarbazaar.com">careers@amaarbazaar.com</a>. We read every application and reply to shortlisted candidates within two weeks.</p>`,
      bn: `
        <p class="lead">বাংলাদেশের সবচেয়ে বিশ্বস্ত বাজার গড়তে আমাদের সঙ্গে যোগ দিন। আমরা একটি ছোট, দ্রুতগতির দল — স্থানীয় ক্রেতা-বিক্রেতার জন্য সত্যিকারের পরিবর্তন আনি।</p>
        <h2>খোলা পদ</h2>
        <div class="info-cards">
          <div class="info-card"><h3>ফ্রন্টএন্ড ইঞ্জিনিয়ার</h3><p>ঢাকা · ফুল-টাইম</p><p>প্রতিদিন লক্ষাধিক মানুষের ব্যবহৃত দ্রুত ওয়েব অভিজ্ঞতা তৈরি করুন।</p></div>
          <div class="info-card"><h3>কমিউনিটি ও ট্রাস্ট লিড</h3><p>ঢাকা · ফুল-টাইম</p><p>বাজার নিরাপদ রাখুন — যাচাই, মডারেশন ও নিরাপত্তা কর্মসূচি পরিচালনা করুন।</p></div>
          <div class="info-card"><h3>গ্রোথ মার্কেটার</h3><p>রিমোট · ফুল-টাইম</p><p>৬৪ জেলায় ক্রেতা-বিক্রেতার সংখ্যা বাড়ান।</p></div>
        </div>
        <h2>আবেদন করবেন যেভাবে</h2>
        <p>আপনার সিভি ও যোগ দিতে চাওয়ার কারণসহ একটি ছোট নোট পাঠান <a href="mailto:careers@amaarbazaar.com">careers@amaarbazaar.com</a> ঠিকানায়। আমরা প্রতিটি আবেদন পড়ি এবং বাছাইকৃতদের দুই সপ্তাহের মধ্যে উত্তর দিই।</p>`
    }
  },
  press: {
    title: { en: 'Press', bn: 'প্রেস' },
    html: {
      en: `
        <p class="lead">News, media resources and company information for journalists and partners.</p>
        <h2>Media enquiries</h2>
        <p>For interviews, data requests or comment, contact our press team at <a href="mailto:press@amaarbazaar.com">press@amaarbazaar.com</a>. We aim to respond within one business day.</p>
        <h2>Recent milestones</h2>
        <ul>
          <li>Crossed 600,000 daily active users across Bangladesh.</li>
          <li>Launched a fully bilingual experience in Bangla and English.</li>
          <li>Added secure payments via bKash, Nagad, Rocket and cards.</li>
        </ul>
        <h2>Brand assets</h2>
        <p>Need our logo or brand guidelines? Email <a href="mailto:press@amaarbazaar.com">press@amaarbazaar.com</a> and we'll share an up-to-date press kit.</p>`,
      bn: `
        <p class="lead">সাংবাদিক ও অংশীদারদের জন্য সংবাদ, মিডিয়া রিসোর্স ও কোম্পানির তথ্য।</p>
        <h2>মিডিয়া অনুসন্ধান</h2>
        <p>সাক্ষাৎকার, তথ্য বা মন্তব্যের জন্য আমাদের প্রেস টিমের সাথে যোগাযোগ করুন <a href="mailto:press@amaarbazaar.com">press@amaarbazaar.com</a> ঠিকানায়। আমরা এক কর্মদিবসের মধ্যে উত্তর দেওয়ার চেষ্টা করি।</p>
        <h2>সাম্প্রতিক অর্জন</h2>
        <ul>
          <li>সারা বাংলাদেশে দৈনিক ৬ লক্ষাধিক সক্রিয় ব্যবহারকারী।</li>
          <li>বাংলা ও ইংরেজিতে সম্পূর্ণ দ্বিভাষিক অভিজ্ঞতা চালু।</li>
          <li>বিকাশ, নগদ, রকেট ও কার্ডে নিরাপদ পেমেন্ট যোগ।</li>
        </ul>
        <h2>ব্র্যান্ড অ্যাসেট</h2>
        <p>লোগো বা ব্র্যান্ড নির্দেশিকা প্রয়োজন? ইমেইল করুন <a href="mailto:press@amaarbazaar.com">press@amaarbazaar.com</a> — আমরা হালনাগাদ প্রেস কিট পাঠাব।</p>`
    }
  },
  safety: {
    title: { en: 'Safety tips', bn: 'নিরাপত্তা টিপস' },
    html: {
      en: `
        <p class="lead">A few simple habits keep buying and selling on AmaarBazaar safe. Please read these before your next deal.</p>
        <h2>When buying</h2>
        <ul>
          <li><strong>Meet in a public place</strong> during daylight — a busy market, shop or café.</li>
          <li><strong>Inspect the item</strong> carefully before you pay. Test phones, electronics and vehicles.</li>
          <li><strong>Never pay in advance</strong> for an item you haven't seen, and avoid wiring money to strangers.</li>
          <li><strong>Don't share OTPs or PINs.</strong> No genuine seller needs your one-time password.</li>
        </ul>
        <h2>When selling</h2>
        <ul>
          <li><strong>Confirm payment</strong> has fully cleared before handing over the item.</li>
          <li><strong>Be cautious of overpayment scams</strong> and requests to refund the "extra".</li>
          <li><strong>Keep conversations on record</strong> until the deal is complete.</li>
        </ul>
        <h2>Spot a problem?</h2>
        <p>If a listing or user looks suspicious, report it to <a href="mailto:safety@amaarbazaar.com">safety@amaarbazaar.com</a>. Our team reviews every report.</p>`,
      bn: `
        <p class="lead">কয়েকটি সহজ অভ্যাস আমারবাজারে কেনাবেচাকে নিরাপদ রাখে। পরবর্তী লেনদেনের আগে এগুলো পড়ুন।</p>
        <h2>কেনার সময়</h2>
        <ul>
          <li><strong>প্রকাশ্য স্থানে দেখা করুন</strong> দিনের আলোয় — ব্যস্ত বাজার, দোকান বা ক্যাফে।</li>
          <li><strong>পণ্য ভালোভাবে যাচাই করুন</strong> টাকা দেওয়ার আগে। ফোন, ইলেকট্রনিক্স ও গাড়ি পরীক্ষা করুন।</li>
          <li><strong>আগে টাকা দেবেন না</strong> না-দেখা পণ্যের জন্য, অপরিচিতকে টাকা পাঠানো এড়িয়ে চলুন।</li>
          <li><strong>OTP বা PIN শেয়ার করবেন না।</strong> প্রকৃত বিক্রেতার আপনার ওটিপি লাগে না।</li>
        </ul>
        <h2>বিক্রির সময়</h2>
        <ul>
          <li><strong>পেমেন্ট সম্পূর্ণ নিশ্চিত</strong> হওয়ার আগে পণ্য হস্তান্তর করবেন না।</li>
          <li><strong>অতিরিক্ত পেমেন্ট প্রতারণা</strong> ও "বাড়তি" ফেরতের অনুরোধে সতর্ক থাকুন।</li>
          <li><strong>আলাপচারিতা সংরক্ষণ করুন</strong> লেনদেন শেষ হওয়া পর্যন্ত।</li>
        </ul>
        <h2>সমস্যা দেখছেন?</h2>
        <p>কোনো বিজ্ঞাপন বা ব্যবহারকারী সন্দেহজনক মনে হলে জানান <a href="mailto:safety@amaarbazaar.com">safety@amaarbazaar.com</a> ঠিকানায়। আমাদের টিম প্রতিটি রিপোর্ট পর্যালোচনা করে।</p>`
    }
  },
  contact: {
    title: { en: 'Contact us', bn: 'যোগাযোগ' },
    html: {
      en: `
        <p class="lead">Questions, feedback or need a hand? Reach us using the details below or send a message.</p>
        <div class="info-contact">
          <div class="info-card"><h3>📧 Email</h3><p><a href="mailto:hello@amaarbazaar.com">hello@amaarbazaar.com</a></p></div>
          <div class="info-card"><h3>📞 Phone</h3><p><a href="tel:+8809600000000">+880 9600 000000</a></p></div>
          <div class="info-card"><h3>📍 Office</h3><p>Gulshan Avenue, Dhaka 1212, Bangladesh</p></div>
          <div class="info-card"><h3>🕘 Hours</h3><p>Sun–Thu, 9am–6pm (BST)</p></div>
        </div>
        <h2>Send us a message</h2>
        <form id="contactForm" class="info-form" novalidate>
          <div class="field-row">
            <div class="field"><label>Name</label><input type="text" id="cfName" required placeholder="Your name"></div>
            <div class="field"><label>Email</label><input type="email" id="cfEmail" required placeholder="you@example.com"></div>
          </div>
          <div class="field"><label>Message</label><textarea id="cfMsg" rows="5" required placeholder="How can we help?"></textarea></div>
          <div class="auth-error" id="cfError"></div>
          <button type="submit" class="btn btn--primary btn--lg">Send message</button>
        </form>`,
      bn: `
        <p class="lead">প্রশ্ন, পরামর্শ বা সাহায্য দরকার? নিচের তথ্যে যোগাযোগ করুন বা বার্তা পাঠান।</p>
        <div class="info-contact">
          <div class="info-card"><h3>📧 ইমেইল</h3><p><a href="mailto:hello@amaarbazaar.com">hello@amaarbazaar.com</a></p></div>
          <div class="info-card"><h3>📞 ফোন</h3><p><a href="tel:+8809600000000">+৮৮০ ৯৬০০ ০০০০০০</a></p></div>
          <div class="info-card"><h3>📍 অফিস</h3><p>গুলশান অ্যাভিনিউ, ঢাকা ১২১২, বাংলাদেশ</p></div>
          <div class="info-card"><h3>🕘 সময়</h3><p>রবি–বৃহস্পতি, সকাল ৯টা–সন্ধ্যা ৬টা</p></div>
        </div>
        <h2>আমাদের বার্তা পাঠান</h2>
        <form id="contactForm" class="info-form" novalidate>
          <div class="field-row">
            <div class="field"><label>নাম</label><input type="text" id="cfName" required placeholder="আপনার নাম"></div>
            <div class="field"><label>ইমেইল</label><input type="email" id="cfEmail" required placeholder="you@example.com"></div>
          </div>
          <div class="field"><label>বার্তা</label><textarea id="cfMsg" rows="5" required placeholder="কীভাবে সাহায্য করতে পারি?"></textarea></div>
          <div class="auth-error" id="cfError"></div>
          <button type="submit" class="btn btn--primary btn--lg">বার্তা পাঠান</button>
        </form>`
    }
  },
  faq: {
    title: { en: 'FAQ', bn: 'সাধারণ প্রশ্ন' },
    html: {
      en: `
        <p class="lead">Answers to the questions we hear most often.</p>
        <div class="faq">
          <details><summary>Is AmaarBazaar free to use?</summary><p>Yes. Browsing, searching and posting a basic ad are completely free. You only pay if you choose to boost an ad to reach more buyers.</p></details>
          <details><summary>How do I post an ad?</summary><p>Click <a href="post.html">Post an Ad</a>, add a title, category, photos, price and your location, then publish. It takes a couple of minutes.</p></details>
          <details><summary>How do I make my ad sell faster?</summary><p>Boost it to Featured or Premium from the posting page. Featured ads are pinned to the top of results and get up to 5× more views.</p></details>
          <details><summary>Which payment methods are supported?</summary><p>You can pay for ad boosts with bKash, Nagad, Rocket or a debit/credit card.</p></details>
          <details><summary>How do I stay safe when trading?</summary><p>Meet in public, inspect items before paying and never pay in advance. See our <a href="info.html?p=safety">Safety tips</a> for more.</p></details>
          <details><summary>How do I edit or remove my ad?</summary><p>Log in to your account, open your ad and use the manage options. Need help? <a href="info.html?p=contact">Contact us</a>.</p></details>
        </div>`,
      bn: `
        <p class="lead">সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নের উত্তর।</p>
        <div class="faq">
          <details><summary>আমারবাজার কি ফ্রি?</summary><p>হ্যাঁ। ব্রাউজ, সার্চ ও সাধারণ বিজ্ঞাপন দেওয়া সম্পূর্ণ ফ্রি। কেবল বিজ্ঞাপন বুস্ট করতে চাইলে টাকা লাগে।</p></details>
          <details><summary>কীভাবে বিজ্ঞাপন দেব?</summary><p><a href="post.html">বিজ্ঞাপন দিন</a> ক্লিক করুন, শিরোনাম, ক্যাটাগরি, ছবি, দাম ও অবস্থান দিন, তারপর প্রকাশ করুন। মাত্র কয়েক মিনিট।</p></details>
          <details><summary>বিজ্ঞাপন দ্রুত বিক্রি করব কীভাবে?</summary><p>পোস্ট পেজ থেকে ফিচার্ড বা প্রিমিয়ামে বুস্ট করুন। ফিচার্ড বিজ্ঞাপন শীর্ষে থাকে ও ৫ গুণ বেশি ভিউ পায়।</p></details>
          <details><summary>কোন পেমেন্ট পদ্ধতি সমর্থিত?</summary><p>বিজ্ঞাপন বুস্টের জন্য বিকাশ, নগদ, রকেট বা ডেবিট/ক্রেডিট কার্ডে পেমেন্ট করতে পারেন।</p></details>
          <details><summary>লেনদেনে নিরাপদ থাকব কীভাবে?</summary><p>প্রকাশ্য স্থানে দেখা করুন, টাকা দেওয়ার আগে যাচাই করুন, আগাম টাকা দেবেন না। বিস্তারিত <a href="info.html?p=safety">নিরাপত্তা টিপস</a>।</p></details>
          <details><summary>বিজ্ঞাপন সম্পাদন বা মুছব কীভাবে?</summary><p>অ্যাকাউন্টে লগ ইন করে বিজ্ঞাপন খুলে ম্যানেজ অপশন ব্যবহার করুন। সাহায্য দরকার? <a href="info.html?p=contact">যোগাযোগ করুন</a>।</p></details>
        </div>`
    }
  },
  terms: {
    title: { en: 'Terms of Service', bn: 'সেবার শর্তাবলী' },
    html: {
      en: `
        <p class="muted">Last updated: June 2026</p>
        <p class="lead">These terms govern your use of AmaarBazaar. By using the site you agree to them.</p>
        <h2>1. Using AmaarBazaar</h2>
        <p>You must be at least 18 years old to post ads. You agree to provide accurate information and to use the marketplace lawfully.</p>
        <h2>2. Your listings</h2>
        <p>You're responsible for the items you list and the content you post. Prohibited, counterfeit, illegal or unsafe items are not allowed and may be removed.</p>
        <h2>3. Transactions</h2>
        <p>AmaarBazaar is a venue that connects buyers and sellers. We are not a party to transactions and don't guarantee any item, payment or user. Please trade carefully and follow our <a href="info.html?p=safety">Safety tips</a>.</p>
        <h2>4. Paid features</h2>
        <p>Boosting an ad is an optional paid service. Fees are shown before you pay and are generally non-refundable once a boost is live.</p>
        <h2>5. Accounts</h2>
        <p>Keep your login details secure. You're responsible for activity on your account. We may suspend accounts that breach these terms.</p>
        <h2>6. Changes</h2>
        <p>We may update these terms from time to time. Continued use of the site means you accept the latest version.</p>
        <p>Questions? Email <a href="mailto:legal@amaarbazaar.com">legal@amaarbazaar.com</a>.</p>`,
      bn: `
        <p class="muted">সর্বশেষ হালনাগাদ: জুন ২০২৬</p>
        <p class="lead">এই শর্তাবলী আমারবাজার ব্যবহারের নিয়ম নির্ধারণ করে। সাইট ব্যবহার করলে আপনি এতে সম্মত হচ্ছেন।</p>
        <h2>১. আমারবাজার ব্যবহার</h2>
        <p>বিজ্ঞাপন দিতে আপনার বয়স কমপক্ষে ১৮ হতে হবে। আপনি সঠিক তথ্য দিতে ও বৈধভাবে বাজার ব্যবহার করতে সম্মত হচ্ছেন।</p>
        <h2>২. আপনার বিজ্ঞাপন</h2>
        <p>আপনি যা তালিকাভুক্ত ও পোস্ট করেন তার দায়িত্ব আপনার। নিষিদ্ধ, নকল, অবৈধ বা অনিরাপদ পণ্য অনুমোদিত নয় এবং সরিয়ে দেওয়া হতে পারে।</p>
        <h2>৩. লেনদেন</h2>
        <p>আমারবাজার ক্রেতা ও বিক্রেতাকে সংযুক্ত করে মাত্র। আমরা লেনদেনের পক্ষ নই এবং কোনো পণ্য, পেমেন্ট বা ব্যবহারকারীর নিশ্চয়তা দিই না। সাবধানে লেনদেন করুন ও <a href="info.html?p=safety">নিরাপত্তা টিপস</a> মানুন।</p>
        <h2>৪. পেইড ফিচার</h2>
        <p>বিজ্ঞাপন বুস্ট একটি ঐচ্ছিক পেইড সেবা। পেমেন্টের আগে ফি দেখানো হয় এবং বুস্ট চালু হলে সাধারণত ফেরতযোগ্য নয়।</p>
        <h2>৫. অ্যাকাউন্ট</h2>
        <p>আপনার লগইন তথ্য সুরক্ষিত রাখুন। অ্যাকাউন্টের কার্যকলাপের দায়িত্ব আপনার। শর্ত লঙ্ঘন করলে আমরা অ্যাকাউন্ট স্থগিত করতে পারি।</p>
        <h2>৬. পরিবর্তন</h2>
        <p>আমরা সময়ে সময়ে এই শর্ত হালনাগাদ করতে পারি। সাইট ব্যবহার চালিয়ে গেলে সর্বশেষ সংস্করণ গৃহীত বলে গণ্য হবে।</p>
        <p>প্রশ্ন? ইমেইল করুন <a href="mailto:legal@amaarbazaar.com">legal@amaarbazaar.com</a>।</p>`
    }
  },
  privacy: {
    title: { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' },
    html: {
      en: `
        <p class="muted">Last updated: June 2026</p>
        <p class="lead">This policy explains what information we collect and how we use it.</p>
        <h2>What we collect</h2>
        <ul>
          <li><strong>Account details</strong> you give us, such as username and email.</li>
          <li><strong>Listing information</strong>, including photos, descriptions and your contact details.</li>
          <li><strong>Usage data</strong>, such as pages viewed and searches, to improve the service.</li>
        </ul>
        <h2>How we use it</h2>
        <p>We use your information to run the marketplace, show your ads to buyers, process ad boosts, keep the site safe and respond to your requests.</p>
        <h2>Sharing</h2>
        <p>We don't sell your personal data. Contact details you publish in a listing are visible to buyers. We share data with payment providers only as needed to process boosts.</p>
        <h2>Your choices</h2>
        <p>You can edit or delete your ads and request deletion of your account by emailing <a href="mailto:privacy@amaarbazaar.com">privacy@amaarbazaar.com</a>.</p>
        <h2>Cookies</h2>
        <p>We use cookies to keep you signed in and remember preferences. See our <a href="info.html?p=cookies">Cookie Policy</a> for details.</p>`,
      bn: `
        <p class="muted">সর্বশেষ হালনাগাদ: জুন ২০২৬</p>
        <p class="lead">এই নীতি ব্যাখ্যা করে আমরা কী তথ্য সংগ্রহ করি ও কীভাবে ব্যবহার করি।</p>
        <h2>আমরা যা সংগ্রহ করি</h2>
        <ul>
          <li><strong>অ্যাকাউন্ট তথ্য</strong> যেমন ইউজারনেম ও ইমেইল।</li>
          <li><strong>বিজ্ঞাপন তথ্য</strong>, ছবি, বর্ণনা ও আপনার যোগাযোগ তথ্যসহ।</li>
          <li><strong>ব্যবহারের তথ্য</strong>, যেমন দেখা পেজ ও সার্চ — সেবা উন্নত করতে।</li>
        </ul>
        <h2>আমরা যেভাবে ব্যবহার করি</h2>
        <p>বাজার পরিচালনা, ক্রেতাদের কাছে বিজ্ঞাপন দেখানো, বুস্ট প্রক্রিয়া, সাইট নিরাপদ রাখা ও আপনার অনুরোধে সাড়া দিতে আমরা তথ্য ব্যবহার করি।</p>
        <h2>শেয়ারিং</h2>
        <p>আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না। বিজ্ঞাপনে প্রকাশিত যোগাযোগ তথ্য ক্রেতারা দেখতে পান। বুস্ট প্রক্রিয়ার প্রয়োজনে কেবল পেমেন্ট প্রদানকারীর সাথে তথ্য শেয়ার করি।</p>
        <h2>আপনার পছন্দ</h2>
        <p>আপনি বিজ্ঞাপন সম্পাদন বা মুছতে পারেন এবং <a href="mailto:privacy@amaarbazaar.com">privacy@amaarbazaar.com</a> ঠিকানায় ইমেইল করে অ্যাকাউন্ট মুছে ফেলার অনুরোধ করতে পারেন।</p>
        <h2>কুকিজ</h2>
        <p>সাইন-ইন রাখা ও পছন্দ মনে রাখতে আমরা কুকিজ ব্যবহার করি। বিস্তারিত <a href="info.html?p=cookies">কুকি নীতি</a>।</p>`
    }
  },
  cookies: {
    title: { en: 'Cookie Policy', bn: 'কুকি নীতি' },
    html: {
      en: `
        <p class="muted">Last updated: June 2026</p>
        <p class="lead">Cookies are small files stored on your device that help the site work and remember your choices.</p>
        <h2>How we use cookies</h2>
        <ul>
          <li><strong>Essential</strong> — keep you signed in and the site secure.</li>
          <li><strong>Preferences</strong> — remember your language (Bangla or English) and saved items.</li>
          <li><strong>Analytics</strong> — help us understand how the site is used so we can improve it.</li>
        </ul>
        <h2>Managing cookies</h2>
        <p>You can clear or block cookies in your browser settings. Some features, like staying logged in or keeping your language choice, may not work without them.</p>
        <p>Questions about cookies? Email <a href="mailto:privacy@amaarbazaar.com">privacy@amaarbazaar.com</a>.</p>`,
      bn: `
        <p class="muted">সর্বশেষ হালনাগাদ: জুন ২০২৬</p>
        <p class="lead">কুকিজ হলো আপনার ডিভাইসে সংরক্ষিত ছোট ফাইল, যা সাইট চালাতে ও আপনার পছন্দ মনে রাখতে সাহায্য করে।</p>
        <h2>আমরা কুকিজ যেভাবে ব্যবহার করি</h2>
        <ul>
          <li><strong>অপরিহার্য</strong> — সাইন-ইন রাখা ও সাইট নিরাপদ রাখা।</li>
          <li><strong>পছন্দ</strong> — আপনার ভাষা (বাংলা বা ইংরেজি) ও সংরক্ষিত আইটেম মনে রাখা।</li>
          <li><strong>অ্যানালিটিক্স</strong> — সাইট কীভাবে ব্যবহৃত হয় তা বুঝে উন্নত করা।</li>
        </ul>
        <h2>কুকিজ নিয়ন্ত্রণ</h2>
        <p>ব্রাউজার সেটিংস থেকে কুকিজ মুছতে বা ব্লক করতে পারেন। তবে লগইন থাকা বা ভাষা পছন্দ মনে রাখার মতো কিছু ফিচার এগুলো ছাড়া কাজ নাও করতে পারে।</p>
        <p>কুকিজ নিয়ে প্রশ্ন? ইমেইল করুন <a href="mailto:privacy@amaarbazaar.com">privacy@amaarbazaar.com</a>।</p>`
    }
  }
};
