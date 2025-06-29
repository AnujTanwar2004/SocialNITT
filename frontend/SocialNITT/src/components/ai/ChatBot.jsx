import React, { useState, useRef, useEffect } from "react";

const SocialNITTChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "👋 Hi! I'm your SocialNITT assistant. I can help you with questions about our platform. Use the menu below or ask me anything!" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const chatbotRef = useRef(null);

  // Comprehensive FAQ Knowledge Base
  const faqDatabase = {
    // Products
    'product': {
      keywords: ['product', 'buy', 'sell', 'marketplace', 'item', 'listing', 'shop'],
      responses: [
        "🛍️ **Products on SocialNITT:**\n\n• Browse products in the marketplace\n• Create product listings to sell items\n• Contact sellers via WhatsApp\n• Filter by category and price\n• View detailed product information\n• Safe transactions between students\n\n*Need help with a specific product feature?*"
      ]
    },
    'create_product': {
      keywords: ['create product', 'add product', 'sell product', 'list product', 'post product', 'sell item'],
      responses: [
        "📝 **Creating a Product Listing:**\n\n1. Go to Products → Create Product\n2. Add product title and description\n3. Set your price and category\n4. Upload clear photos (multiple angles)\n5. Add your contact details\n6. Submit for review\n\n*Tips: Use good lighting for photos and be honest about condition!*"
      ]
    },
    'edit_product': {
      keywords: ['edit product', 'update product', 'modify product', 'change product', 'delete product'],
      responses: [
        "✏️ **Managing Your Products:**\n\n• **Edit:** Go to your dashboard → Select product → Edit\n• **Delete:** Remove listings when sold\n• **Update Price:** Modify pricing anytime\n• **Mark as Sold:** Update status when sold\n• **Reactivate:** Republish if needed\n\n*Keep your listings current for better responses!*"
      ]
    },
    'product_issues': {
      keywords: ['product not showing', 'cant see product', 'product disappeared', 'listing missing', 'product error'],
      responses: [
        "🔍 **Product Display Issues:**\n\n• **Not Visible:** Check if it's under review\n• **Missing Photos:** Re-upload images in JPG/PNG format\n• **Category Error:** Ensure correct category selection\n• **Refresh:** Try logging out and back in\n• **Contact Admin:** For persistent issues\n\n*Most issues resolve within 24 hours of posting.*"
      ]
    },

    // Services
    'service': {
      keywords: ['service', 'help', 'assistance', 'offer service', 'request service', 'skill'],
      responses: [
        "🔧 **Services on SocialNITT:**\n\n• Offer your skills to other students\n• Request services you need\n• Set your budget and urgency level\n• Categories: Academic, Technical, Personal, Creative\n• Direct WhatsApp contact with providers\n• Build your reputation through reviews\n\n*What kind of service are you looking for?*"
      ]
    },
    'create_service': {
      keywords: ['create service', 'offer service', 'add service', 'post service', 'provide service'],
      responses: [
        "💼 **Creating a Service Listing:**\n\n1. Navigate to Services → Create Service\n2. Choose type (Offering/Requesting)\n3. Select category and set budget\n4. Set urgency level (Low/Medium/High)\n5. Add detailed description with examples\n6. Include your location and availability\n7. Submit with contact info\n\n*Detailed descriptions get more responses!*"
      ]
    },
    'service_types': {
      keywords: ['types of services', 'service categories', 'what services', 'available services'],
      responses: [
        "📋 **Popular Service Categories:**\n\n**Academic:**\n• Assignment help, tutoring, project guidance\n• Research assistance, presentation prep\n\n**Technical:**\n• Web development, app creation, coding help\n• IT support, software installation\n\n**Personal:**\n• Event planning, photography, content creation\n• Transportation, moving help, shopping\n\n**Creative:**\n• Graphic design, video editing, writing\n• Music lessons, art commissions"
      ]
    },
    'service_pricing': {
      keywords: ['service price', 'how much charge', 'service cost', 'pricing service', 'service rate'],
      responses: [
        "💰 **Service Pricing Guidelines:**\n\n**Academic Services:** ₹50-500/hour\n• Basic tutoring: ₹50-150/hour\n• Assignment help: ₹100-300/project\n• Research work: ₹200-500/project\n\n**Technical Services:** ₹100-1000/project\n• Simple websites: ₹500-2000\n• App development: ₹1000-5000\n• IT troubleshooting: ₹100-300\n\n*Prices vary by complexity and urgency!*"
      ]
    },

    // Food
    'food': {
      keywords: ['food', 'meal', 'restaurant', 'delivery', 'order', 'eat', 'hungry', 'canteen'],
      responses: [
        "🍕 **Food on SocialNITT:**\n\n• Discover local food options near campus\n• Share food recommendations and reviews\n• Find group orders for discounts\n• Rate restaurants and dishes\n• Connect with fellow food enthusiasts\n• Get delivery updates and timings\n\n*Hungry? Let's find you something delicious!*"
      ]
    },
    'create_food': {
      keywords: ['create food', 'add food', 'food listing', 'recommend food', 'add restaurant'],
      responses: [
        "🍽️ **Adding Food Listings:**\n\n1. Go to Food → Create Food\n2. Add restaurant/food item name\n3. Include description and price range\n4. Upload appetizing photos\n5. Add location and contact details\n6. Set category and cuisine type\n7. Add operating hours and delivery info\n\n*High-quality photos get more attention!*"
      ]
    },
    'food_delivery': {
      keywords: ['food delivery', 'order food', 'delivery time', 'food ordering', 'home delivery'],
      responses: [
        "🚚 **Food Delivery Info:**\n\n**Popular Delivery Apps:**\n• Zomato, Swiggy, Uber Eats\n• Direct restaurant contact\n\n**Campus Area Delivery:**\n• Most restaurants deliver to hostels\n• Typical delivery time: 30-45 minutes\n• Group orders often get discounts\n• Check for student offers and coupons\n\n*Many restaurants offer student discounts!*"
      ]
    },
    'campus_food': {
      keywords: ['campus food', 'hostel mess', 'canteen', 'mess food', 'campus restaurant'],
      responses: [
        "🏫 **Campus Food Options:**\n\n**Hostel Mess:**\n• Fixed meal timings\n• Monthly mess bills\n• Special occasion meals\n\n**Campus Canteens:**\n• Affordable student pricing\n• Quick snacks and meals\n• Extended hours during exams\n\n**Nearby Restaurants:**\n• Student-friendly pricing\n• Late-night options available\n• Group study meal deals"
      ]
    },

    // Technical Issues
    'technical_issues': {
      keywords: ['not working', 'error', 'bug', 'crash', 'slow', 'loading', 'broken', 'technical problem'],
      responses: [
        "🔧 **Technical Troubleshooting:**\n\n**Common Fixes:**\n• Clear browser cache and cookies\n• Disable ad blockers temporarily\n• Try incognito/private browsing\n• Check internet connection\n• Update your browser\n• Restart the app/refresh page\n\n**Still Having Issues?**\n• Take a screenshot of the error\n• Note what you were doing when it happened\n• Contact support with details"
      ]
    },
    'upload_issues': {
      keywords: ['upload error', 'image not uploading', 'photo problem', 'file upload', 'picture error'],
      responses: [
        "📸 **Upload Troubleshooting:**\n\n**Image Requirements:**\n• Formats: JPG, PNG, JPEG only\n• Max size: 5MB per image\n• Recommended: 1024x1024 pixels\n• Clear, well-lit photos\n\n**Upload Problems:**\n• Check file size and format\n• Ensure stable internet connection\n• Try uploading one image at a time\n• Compress large images before upload\n• Clear browser cache if persistent"
      ]
    },

    // Account & Authentication
    'account': {
      keywords: ['account', 'profile', 'login', 'register', 'password', 'settings', 'sign up'],
      responses: [
        "👤 **Account Management:**\n\n• **Login Issues:** Check email/password carefully\n• **Registration:** Use your NIT Trichy email only\n• **Profile:** Update info and add profile picture\n• **Password:** Use 'Forgot Password' for reset\n• **Settings:** Manage notifications and privacy\n• **Verification:** Check email for verification links\n\n*Having trouble accessing your account?*"
      ]
    },
    'password_reset': {
      keywords: ['forgot password', 'reset password', 'password reset', 'cant login', 'password problem'],
      responses: [
        "🔐 **Password Reset Steps:**\n\n1. Go to login page\n2. Click 'Forgot Password'\n3. Enter your registered email\n4. Check email for reset link\n5. Click the link in email\n6. Create a new strong password\n7. Login with new password\n\n**Password Tips:**\n• Use 8+ characters\n• Include numbers and symbols\n• Don't reuse old passwords\n\n*Check spam folder if email doesn't arrive!*"
      ]
    },
    'verification': {
      keywords: ['email verification', 'verify account', 'verification email', 'activate account'],
      responses: [
        "✅ **Account Verification:**\n\n**Steps to Verify:**\n1. Check your NIT Trichy email\n2. Look for verification email from SocialNITT\n3. Click the verification link\n4. Your account will be activated\n\n**Email Not Received?**\n• Check spam/junk folder\n• Ensure you used correct NIT email\n• Request new verification email\n• Contact support if still missing\n\n*Only verified accounts can post listings!*"
      ]
    },
    'profile_setup': {
      keywords: ['profile setup', 'complete profile', 'profile picture', 'profile info', 'edit profile'],
      responses: [
        "📋 **Setting Up Your Profile:**\n\n**Essential Information:**\n• Profile picture (clear, professional)\n• Full name and year of study\n• Branch/Department\n• Hostel/Location details\n• Contact preferences\n• Bio/Introduction (optional)\n\n**Privacy Settings:**\n• Control who can contact you\n• Manage notification preferences\n• Set visibility of personal info\n\n*Complete profiles get more responses!*"
      ]
    },

    // Safety & Security
    'safety': {
      keywords: ['safety', 'secure', 'scam', 'fraud', 'suspicious', 'report user', 'block user'],
      responses: [
        "🛡️ **Safety Guidelines:**\n\n**Stay Safe:**\n• Meet in public places on campus\n• Verify seller identity before payment\n• Use campus locations for exchanges\n• Trust your instincts about people\n• Don't share personal financial info\n\n**Report Issues:**\n• Suspicious listings or users\n• Inappropriate behavior\n• Scam attempts\n• Fake products/services\n\n*Your safety is our priority!*"
      ]
    },
    'payment_safety': {
      keywords: ['payment', 'money', 'transaction', 'pay', 'payment safety', 'how to pay'],
      responses: [
        "💳 **Payment Safety Tips:**\n\n**Safe Payment Methods:**\n• Cash on delivery/pickup\n• UPI after inspection\n• Bank transfer for verified sellers\n• Avoid advance payments to strangers\n\n**Red Flags:**\n• Requests for advance payment\n• Deals that seem too good to be true\n• Pressure to pay immediately\n• Reluctance to meet in person\n\n**Best Practice:** Pay only after seeing and verifying the product!"
      ]
    },
    'report_user': {
      keywords: ['report', 'block', 'spam', 'inappropriate', 'abuse', 'harassment'],
      responses: [
        "🚨 **Reporting Users/Content:**\n\n**How to Report:**\n• Click on user's profile\n• Select 'Report User'\n• Choose reason for reporting\n• Provide additional details\n• Submit report\n\n**Report Reasons:**\n• Fake listings\n• Inappropriate behavior\n• Spam or scam attempts\n• Harassment\n• Terms violation\n\n*All reports are reviewed within 24 hours.*"
      ]
    },

    // General Platform Help
    'contact': {
      keywords: ['contact', 'support', 'help', 'issue', 'problem', 'customer service', 'admin'],
      responses: [
        "📞 **Getting Help:**\n\n**Contact Methods:**\n• **Chat:** Use this chatbot for instant help\n• **Email:** support@socialnitt.com\n• **WhatsApp:** Contact sellers directly\n• **Report:** Use in-app reporting for issues\n\n**Response Times:**\n• Chatbot: Instant\n• Email support: 24-48 hours\n• Reports: Within 24 hours\n\n*I'm here to help with any questions!*"
      ]
    },
    'navigation': {
      keywords: ['navigate', 'menu', 'where', 'how to find', 'dashboard', 'how to use'],
      responses: [
        "🧭 **Platform Navigation:**\n\n**Main Sections:**\n• **Home:** Latest listings and updates\n• **Products:** Buy/sell marketplace\n• **Services:** Skill exchange platform\n• **Food:** Restaurant recommendations\n• **Profile:** Your account and listings\n\n**Quick Actions:**\n• Search bar for specific items\n• Filter by category/price\n• Sort by date/popularity\n• Save favorites for later\n\n*Use the search function to find specific items quickly!*"
      ]
    },
    'rules': {
      keywords: ['rules', 'guidelines', 'policy', 'terms', 'allowed', 'prohibited', 'community guidelines'],
      responses: [
        "📋 **Community Guidelines:**\n\n**Basic Rules:**\n• Only NIT Trichy students can join\n• Be respectful and honest always\n• No spam or irrelevant content\n• Accurate descriptions and fair pricing\n• No offensive or inappropriate content\n\n**Prohibited:**\n• Fake accounts or listings\n• Harassment or bullying\n• Adult content\n• Illegal items or services\n• Misleading information\n\n*Violations may result in account suspension!*"
      ]
    },
    'features': {
      keywords: ['features', 'what can i do', 'platform features', 'functionality', 'capabilities'],
      responses: [
        "⭐ **SocialNITT Features:**\n\n**Marketplace:**\n• Buy and sell products\n• Service exchange platform\n• Food recommendations\n• Direct messaging via WhatsApp\n\n**Social Features:**\n• Student community network\n• Reviews and ratings\n• Follow favorite sellers\n• Group orders and collaborations\n\n**Smart Features:**\n• Advanced search and filters\n• Price comparison\n• Location-based listings\n• Notification system"
      ]
    },
    'getting_started': {
      keywords: ['getting started', 'how to start', 'new user', 'first time', 'tutorial', 'guide'],
      responses: [
        "🚀 **Getting Started Guide:**\n\n**For New Users:**\n1. Verify your NIT Trichy email\n2. Complete your profile setup\n3. Browse existing listings\n4. Understand community guidelines\n5. Start with small transactions\n\n**First Steps:**\n• Explore different categories\n• Follow active users\n• Join relevant groups\n• Ask questions in this chat\n• Start building your reputation\n\n*Welcome to the SocialNITT community!*"
      ]
    },
    'notifications': {
      keywords: ['notifications', 'alerts', 'notify', 'notification settings', 'push notifications'],
      responses: [
        "🔔 **Notification Settings:**\n\n**Types of Notifications:**\n• New messages from buyers/sellers\n• Price drops on saved items\n• New listings in your categories\n• Service request responses\n• Account security alerts\n\n**Manage Notifications:**\n• Go to Profile → Settings\n• Choose notification preferences\n• Set quiet hours\n• Enable/disable specific types\n• Email vs push notification options\n\n*Customize to avoid spam while staying informed!*"
      ]
    },
    'search_tips': {
      keywords: ['search', 'find', 'filter', 'search tips', 'how to search', 'search better'],
      responses: [
        "🔍 **Search Tips & Tricks:**\n\n**Better Search Results:**\n• Use specific keywords (e.g., 'iPhone 13' not just 'phone')\n• Try different word combinations\n• Use filters for price range, category\n• Sort by newest or price\n• Check spelling carefully\n\n**Advanced Filters:**\n• Location within campus\n• Price range selection\n• Condition (new/used)\n• Posted date range\n• User ratings\n\n*Specific searches give better results!*"
      ]
    }
  };

  // Quick FAQ Menu - 3 rows of common questions
  const quickFAQMenu = [
    // Row 1 - Account & Setup
    [
      { text: "🔐 Reset Password", query: "How to reset password?" },
      { text: "✅ Verify Email", query: "Email verification not working" },
      { text: "👤 Profile Setup", query: "Complete profile setup" }
    ],
    // Row 2 - Main Features  
    [
      { text: "🛍️ Sell Products", query: "How to create a product listing?" },
      { text: "💼 Offer Service", query: "How to offer a service?" },
      { text: "🍕 Add Restaurant", query: "How to add restaurant recommendation?" }
    ],
    // Row 3 - Help & Safety
    [
      { text: "🛡️ Safety Tips", query: "Payment safety tips" },
      { text: "🔧 Upload Issues", query: "Upload troubleshooting" },
      { text: "📋 Getting Started", query: "Getting started guide" }
    ]
  ];

  const quickSuggestions = [
    "How to sell products?",
    "Create service listing",
    "Find food options",
    "Account verification"
  ];

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target) &&
        open
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    Object.entries(faqDatabase).forEach(([key, data]) => {
      const score = data.keywords.reduce((acc, keyword) => {
        if (input.includes(keyword)) {
          return acc + keyword.length;
        }
        return acc;
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = data;
      }
    });

    return bestMatch;
  };

  const sendMessage = async (messageText = null) => {
    const userMessage = messageText || input.trim();
    if (!userMessage) return;

    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setLoading(true);
    setInput("");

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const match = findBestMatch(userMessage);
    
    let response;
    if (match) {
      response = match.responses[0];
    } else {
      // Enhanced fallback responses for unmatched queries
      const fallbackResponses = [
        "🤔 I'm not sure about that specific question, but I can help you with:\n\n• **Products** - Buying, selling, and marketplace issues\n• **Services** - Offering skills or requesting help\n• **Food** - Restaurant recommendations and delivery\n• **Account** - Login, verification, and profile setup\n• **Safety** - Payment security and reporting users\n• **Technical** - Upload issues and troubleshooting\n\nCould you try asking about one of these topics?",
        
        "💡 I'd love to help! Here are some popular questions I can answer:\n\n• How to create and manage listings\n• Platform navigation and features\n• Account verification and password reset\n• Safety guidelines and payment tips\n• Technical troubleshooting\n• Community rules and guidelines\n\nWhat would you like to know more about?",
        
        "📱 SocialNITT connects NIT Trichy students for buying, selling, and helping each other. I can guide you through:\n\n• **Marketplace Features** - Products and services\n• **Getting Started** - Account setup and verification\n• **Safety Tips** - Secure transactions and reporting\n• **Technical Help** - Upload issues and bugs\n• **Platform Rules** - Community guidelines\n\nWhat specific area can I help you with?",
        
        "🎓 As your SocialNITT assistant, I'm here to help with any platform-related questions! Try asking about:\n\n• **\"How to sell products\"** - Step-by-step selling guide\n• **\"Payment safety\"** - Secure transaction tips\n• **\"Upload issues\"** - Photo and listing problems\n• **\"Account verification\"** - Email verification help\n• **\"Report user\"** - Safety and reporting features\n\nOr just describe what you're trying to do!"
      ];
      response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    setMessages((msgs) => [...msgs, { from: "bot", text: response }]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleFAQClick = (faqItem) => {
    sendMessage(faqItem.query);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <div
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 9999
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "linear-gradient(135deg, #850E35, #a91142)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "1.5rem",
            boxShadow: "0 4px 16px rgba(133, 14, 53, 0.3)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 20px rgba(133, 14, 53, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 16px rgba(133, 14, 53, 0.3)";
          }}
          aria-label="Open SocialNITT FAQ Chatbot"
        >
          🤖
        </button>
      </div>

      {/* Chatbot Panel */}
      {open && (
        <div
          ref={chatbotRef}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "32px",
            width: "380px",
            maxHeight: "500px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e1e5e9"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #850E35, #a91142)",
              color: "#fff",
              padding: "16px",
              fontWeight: "600",
              fontSize: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🎓</span>
              SocialNITT FAQ Bot
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
              onMouseOut={(e) => e.target.style.background = "none"}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            ref={panelRef}
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              background: "#f8f9fa",
              maxHeight: "300px"
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  margin: "12px 0"
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: msg.from === "user" 
                      ? "linear-gradient(135deg, #850E35, #a91142)" 
                      : "#fff",
                    color: msg.from === "user" ? "#fff" : "#333",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    maxWidth: "85%",
                    wordBreak: "break-word",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: msg.from === "bot" ? "1px solid #e1e5e9" : "none",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    whiteSpace: "pre-line"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ textAlign: "left", color: "#666", padding: "8px 0" }}>
                <div style={{
                  display: "inline-block",
                  background: "#fff",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #e1e5e9"
                }}>
                  <span style={{ fontSize: "14px" }}>🤖 Thinking...</span>
                </div>
              </div>
            )}

            {/* Initial Quick Suggestions - only show when conversation starts */}
            {messages.length === 1 && !loading && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "500" }}>
                  💡 Popular questions:
                </div>
                {quickSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: "#fff",
                      border: "1px solid #e1e5e9",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      margin: "4px 0",
                      fontSize: "13px",
                      color: "#333",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#f0f0f0";
                      e.target.style.borderColor = "#850E35";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#fff";
                      e.target.style.borderColor = "#e1e5e9";
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick FAQ Menu - Always Visible */}
          <div
            style={{
              padding: "12px 16px",
              background: "#fff",
              borderTop: "1px solid #e1e5e9",
              borderBottom: "1px solid #e1e5e9"
            }}
          >
            <div style={{ fontSize: "11px", color: "#666", marginBottom: "8px", textAlign: "center", fontWeight: "500" }}>
              📋 Quick FAQ Menu
            </div>
            {quickFAQMenu.map((row, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: rowIdx < quickFAQMenu.length - 1 ? "6px" : "0"
                }}
              >
                {row.map((faqItem, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => handleFAQClick(faqItem)}
                    style={{
                      flex: 1,
                      background: "#f8f9fa",
                      border: "1px solid #e1e5e9",
                      borderRadius: "6px",
                      padding: "8px 4px",
                      fontSize: "11px",
                      color: "#555",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                      fontWeight: "500",
                      minHeight: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#850E35";
                      e.target.style.color = "#fff";
                      e.target.style.borderColor = "#850E35";
                      e.target.style.transform = "scale(1.02)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#f8f9fa";
                      e.target.style.color = "#555";
                      e.target.style.borderColor = "#e1e5e9";
                      e.target.style.transform = "scale(1)";
                    }}
                    title={faqItem.query}
                  >
                    {faqItem.text}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div
            style={{
              display: "flex",
              background: "#fff",
              padding: "12px"
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about SocialNITT..."
              style={{
                flex: 1,
                border: "1px solid #e1e5e9",
                borderRadius: "20px",
                padding: "10px 16px",
                outline: "none",
                fontSize: "14px",
                marginRight: "8px"
              }}
              disabled={loading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                background: "linear-gradient(135deg, #850E35, #a91142)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s"
              }}
              disabled={loading}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialNITTChatbot;