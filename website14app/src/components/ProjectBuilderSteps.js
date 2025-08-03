import { useState } from 'react';

// Step 1: Business Analysis
export const Step1BusinessAnalysis = ({ formData, handleInputChange, businessTypes, validationErrors = {}, recommendations = { features: [], pages: [], purpose: '', budget: '', timeline: '' } }) => {
    const [businessTypeInput, setBusinessTypeInput] = useState(formData.businessType || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    // Filter business type suggestions
    const filterSuggestions = (input) => {
        const allTypes = Object.values(businessTypes).flat();
        const filtered = allTypes.filter(type =>
            type.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
    };

    // Handle business type input change
    const handleBusinessTypeInputChange = (e) => {
        const value = e.target.value;
        setBusinessTypeInput(value);
        handleInputChange('businessType', value);
        filterSuggestions(value);
        setShowSuggestions(true);
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion) => {
        setBusinessTypeInput(suggestion);
        handleInputChange('businessType', suggestion);
        setShowSuggestions(false);
        setFilteredSuggestions([]);
    };

    // Handle input blur (hide suggestions after a delay)
    const handleInputBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your business</h3>
                <p className="text-gray-600">Let's start with the basics to understand your needs better</p>
            </div>

            {/* Business Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your business name? *
                </label>
                <input
                    type="text"
                    value={formData.businessName || ''}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter your business name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.businessName}</p>
                )}
            </div>

            {/* Business Type */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What type of business do you have? *
                </label>
                <input
                    type="text"
                    value={businessTypeInput}
                    onChange={handleBusinessTypeInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={handleInputBlur}
                    placeholder="Start typing your business type..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.businessType ? 'border-red-500' : 'border-gray-300'}`}
                />

                {/* Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2">
                            <div className="text-xs text-gray-500 mb-2 px-2">Suggestions:</div>
                            <div className="flex flex-wrap gap-2">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Popular Categories */}
                {!businessTypeInput && (
                    <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-2">Popular categories:</div>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(businessTypes).slice(0, 6).map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleSuggestionClick(category)}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {validationErrors.businessType && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.businessType}</p>
                )}
            </div>

            {/* Industry */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What industry are you in? *
                </label>
                <select
                    value={formData.industry || ''}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.industry ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="">Select your industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Non-profit">Non-profit</option>
                    <option value="Other">Other</option>
                </select>
                {validationErrors.industry && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.industry}</p>
                )}
            </div>

            {/* Business Size */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many employees do you have?
                </label>
                <select
                    value={formData.businessSize || ''}
                    onChange={(e) => handleInputChange('businessSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select business size</option>
                    <option value="1-5">1-5 employees (Startup/Solo)</option>
                    <option value="6-25">6-25 employees (Small Business)</option>
                    <option value="26-100">26-100 employees (Medium Business)</option>
                    <option value="100+">100+ employees (Large Business)</option>
                </select>
            </div>

            {/* Current Online Presence */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you currently have a website?
                </label>
                <div className="space-y-2">
                    {[
                        "No, this is my first website",
                        "Yes, but it's outdated",
                        "Yes, but I need a new one",
                        "Yes, but I want to improve it"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="currentOnlinePresence"
                                value={option}
                                checked={formData.currentOnlinePresence === option}
                                onChange={(e) => handleInputChange('currentOnlinePresence', e.target.value)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Current Website URL */}
            {formData.currentOnlinePresence && formData.currentOnlinePresence.includes('Yes') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        What's your current website URL?
                    </label>
                    <input
                        type="url"
                        value={formData.currentWebsiteUrl || ''}
                        onChange={(e) => handleInputChange('currentWebsiteUrl', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            )}
        </div>
    );
};

// Step 2: Website Goals
export const Step2WebsiteGoals = ({ formData, handleInputChange, handleMultiSelect, validationErrors = {}, recommendations = { features: [], pages: [], purpose: '', budget: '', timeline: '' } }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">What are your website goals?</h3>
                <p className="text-gray-600">This helps us recommend the perfect features for your success</p>
            </div>

            {/* Primary Goals */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your primary goals for this website? (select all that apply) *
                </label>
                <div className="space-y-2">
                    {[
                        "Increase brand awareness",
                        "Generate more leads",
                        "Sell products online",
                        "Provide customer support",
                        "Share information and resources",
                        "Build a community",
                        "Showcase portfolio/work",
                        "Improve customer engagement"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.primaryGoals && formData.primaryGoals.includes(option) || false}
                                onChange={(e) => handleMultiSelect('primaryGoals', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
                {validationErrors.primaryGoals && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.primaryGoals}</p>
                )}
            </div>

            {/* Target Audience */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who is your target audience? (select all that apply)
                </label>
                <div className="space-y-2">
                    {[
                        "Individual consumers",
                        "Small businesses",
                        "Large corporations",
                        "Government agencies",
                        "Non-profit organizations",
                        "Educational institutions",
                        "Healthcare providers",
                        "Technology companies"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.targetAudience && formData.targetAudience.includes(option) || false}
                                onChange={(e) => handleMultiSelect('targetAudience', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Success Metrics */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    How will you measure success? (select all that apply)
                </label>
                <div className="space-y-2">
                    {[
                        "Website traffic increase",
                        "Lead generation",
                        "Online sales",
                        "Customer engagement",
                        "Brand recognition",
                        "Customer satisfaction",
                        "Cost reduction",
                        "Time savings"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.successMetrics && formData.successMetrics.includes(option) || false}
                                onChange={(e) => handleMultiSelect('successMetrics', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Step 3: Content Needs
export const Step3ContentNeeds = ({ formData, handleInputChange, handleMultiSelect, validationErrors = {}, recommendations = { features: [], pages: [], purpose: '', budget: '', timeline: '' } }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Content Management Needs</h3>
                <p className="text-gray-600">How often will you need to update your website content?</p>
            </div>

            {/* Content Update Frequency */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    How often will you need to update your website content? *
                </label>
                <div className="space-y-3">
                    {[
                        {
                            value: "Rarely - Static content is fine",
                            description: "Perfect for businesses with stable information that rarely changes"
                        },
                        {
                            value: "Monthly - Occasional updates",
                            description: "Good for businesses that update content a few times per year"
                        },
                        {
                            value: "Weekly - Regular content updates",
                            description: "Ideal for businesses that add blog posts, news, or regular updates"
                        },
                        {
                            value: "Daily - Frequent content management",
                            description: "Best for businesses that need to update content daily or multiple times per week"
                        }
                    ].map((option) => (
                        <label key={option.value} className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="contentUpdateFrequency"
                                value={option.value}
                                checked={formData.contentUpdateFrequency === option.value}
                                onChange={(e) => handleInputChange('contentUpdateFrequency', e.target.value)}
                                className="mr-3 mt-1"
                            />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{option.value}</div>
                                <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                            </div>
                        </label>
                    ))}
                </div>
                {validationErrors.contentUpdateFrequency && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.contentUpdateFrequency}</p>
                )}
            </div>

            {/* Content Types */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What types of content will you be publishing? (select all that apply)
                </label>
                <div className="space-y-2">
                    {[
                        "Blog posts and articles",
                        "Product information",
                        "Company news and updates",
                        "Case studies and testimonials",
                        "Educational resources",
                        "Event announcements",
                        "Team member profiles",
                        "Service descriptions"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.contentTypes && formData.contentTypes.includes(option) || false}
                                onChange={(e) => handleMultiSelect('contentTypes', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Content Ownership */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who will be managing the content?
                </label>
                <div className="space-y-2">
                    {[
                        "I'll manage it myself",
                        "My team will manage it",
                        "I'll hire someone to manage it",
                        "I want you to manage it for me"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="contentOwnership"
                                value={option}
                                checked={formData.contentOwnership === option}
                                onChange={(e) => handleInputChange('contentOwnership', e.target.value)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Step 4: User Experience
export const Step4UserExperience = ({ formData, handleInputChange, handleMultiSelect, validationErrors = {}, recommendations = { features: [], pages: [], purpose: '', budget: '', timeline: '' } }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">User Experience Features</h3>
                <p className="text-gray-600">What user features does your website need?</p>
            </div>

            {/* User Features */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What user features do you need? (select all that apply) *
                </label>
                <div className="space-y-2">
                    {[
                        "Contact forms",
                        "Newsletter signup",
                        "User accounts",
                        "Member areas",
                        "Customer portal",
                        "Online booking/appointments",
                        "Live chat support",
                        "User reviews and ratings"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.userFeatures && formData.userFeatures.includes(option) || false}
                                onChange={(e) => handleMultiSelect('userFeatures', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
                {validationErrors.userFeatures && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.userFeatures}</p>
                )}
            </div>

            {/* Mobile Usage */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    How important is mobile usage for your customers?
                </label>
                <div className="space-y-2">
                    {[
                        "Essential - Most customers use mobile",
                        "Important - Many customers use mobile",
                        "Somewhat important - Mixed usage",
                        "Not important - Primarily desktop users"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="mobileUsage"
                                value={option}
                                checked={formData.mobileUsage === option}
                                onChange={(e) => handleInputChange('mobileUsage', e.target.value)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Accessibility */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you need accessibility features? (select all that apply)
                </label>
                <div className="space-y-2">
                    {[
                        "Screen reader compatibility",
                        "Keyboard navigation",
                        "High contrast mode",
                        "Font size adjustment",
                        "Alt text for images",
                        "No accessibility requirements"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.accessibilityRequirements && formData.accessibilityRequirements.includes(option) || false}
                                onChange={(e) => handleMultiSelect('accessibilityRequirements', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Step 5: E-commerce Analysis
export const Step5EcommerceAnalysis = ({ formData, handleInputChange, handleMultiSelect, validationErrors = {} }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">E-commerce Analysis</h3>
                <p className="text-gray-600">Let's understand your online selling needs</p>
            </div>

            {/* Selling Online */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you plan to sell products or services online? *
                </label>
                <div className="space-y-2">
                    {[
                        "Yes, I want to sell products",
                        "Yes, I want to sell services",
                        "Yes, I want to sell both",
                        "No, I don't plan to sell online"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="sellingOnline"
                                value={option}
                                checked={formData.sellingOnline === option}
                                onChange={(e) => handleInputChange('sellingOnline', e.target.value)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
                {validationErrors.sellingOnline && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.sellingOnline}</p>
                )}
            </div>

            {/* Product Types */}
            {(formData.sellingOnline && formData.sellingOnline.includes('products')) && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        What types of products will you sell? (select all that apply)
                    </label>
                    <div className="space-y-2">
                        {[
                            "Physical products",
                            "Digital products",
                            "Subscriptions",
                            "Memberships",
                            "Gift cards",
                            "Custom orders"
                        ].map((option) => (
                            <label key={option} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={formData.productTypes && formData.productTypes.includes(option) || false}
                                    onChange={(e) => handleMultiSelect('productTypes', option)}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Count */}
            {(formData.sellingOnline && formData.sellingOnline.includes('products')) && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        How many products do you plan to sell?
                    </label>
                    <input
                        type="number"
                        value={formData.productCount || ''}
                        onChange={(e) => handleInputChange('productCount', e.target.value)}
                        placeholder="Enter number of products"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            )}

            {/* Payment Methods */}
            {(formData.sellingOnline && formData.sellingOnline !== "No, I don't plan to sell online") && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        What payment methods do you want to accept? (select all that apply)
                    </label>
                    <div className="space-y-2">
                        {[
                            "Credit/Debit Cards",
                            "PayPal",
                            "Apple Pay",
                            "Google Pay",
                            "Bank transfers",
                            "Cash on delivery",
                            "Cryptocurrency"
                        ].map((option) => (
                            <label key={option} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={formData.paymentMethods && formData.paymentMethods.includes(option) || false}
                                    onChange={(e) => handleMultiSelect('paymentMethods', option)}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Inventory Management */}
            {(formData.sellingOnline && formData.sellingOnline.includes('products')) && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Do you need inventory management?
                    </label>
                    <div className="space-y-2">
                        {[
                            "Yes, I need to track stock levels",
                            "Yes, I need low stock alerts",
                            "Yes, I need automated reordering",
                            "No, I don't need inventory management"
                        ].map((option) => (
                            <label key={option} className="flex items-center">
                                <input
                                    type="radio"
                                    name="inventoryManagement"
                                    value={option}
                                    checked={formData.inventoryManagement === option}
                                    onChange={(e) => handleInputChange('inventoryManagement', e.target.value)}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Step 6: Technical Requirements
export const Step6TechnicalRequirements = ({ formData, handleInputChange, handleMultiSelect, validationErrors = {} }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Technical Requirements</h3>
                <p className="text-gray-600">What integrations and technical features do you need?</p>
            </div>

            {/* Integrations */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What integrations do you need? (select all that apply)
                </label>
                <div className="space-y-2">
                    {[
                        "Google Analytics",
                        "Google Maps",
                        "Social Media",
                        "Email marketing",
                        "CRM system",
                        "Accounting software",
                        "Booking system",
                        "Live chat"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.integrations && formData.integrations.includes(option) || false}
                                onChange={(e) => handleMultiSelect('integrations', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Security Needs */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What security features do you need? (select all that apply)
                </label>
                <div className="space-y-2">
                    {[
                        "SSL certificate",
                        "Data encryption",
                        "User authentication",
                        "Payment security",
                        "Backup systems",
                        "No special security requirements"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.securityNeeds && formData.securityNeeds.includes(option) || false}
                                onChange={(e) => handleMultiSelect('securityNeeds', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Performance Requirements */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    How important is website speed and performance?
                </label>
                <div className="space-y-2">
                    {[
                        "Critical - Speed is essential for my business",
                        "Important - Good performance is needed",
                        "Standard - Normal performance is fine",
                        "Not a priority - Basic performance is okay"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="performanceRequirements"
                                value={option}
                                checked={formData.performanceRequirements === option}
                                onChange={(e) => handleInputChange('performanceRequirements', e.target.value)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Compliance Requirements */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you need any compliance features? (select all that apply)
                </label>
                <div className="space-y-2">
                    {[
                        "GDPR compliance",
                        "HIPAA compliance",
                        "PCI DSS compliance",
                        "ADA compliance",
                        "Industry-specific compliance",
                        "No compliance requirements"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.complianceRequirements && formData.complianceRequirements.includes(option) || false}
                                onChange={(e) => handleMultiSelect('complianceRequirements', option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Step 7: Timeline & Budget
export const Step7TimelineBudget = ({ formData, handleInputChange, validationErrors = {} }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Timeline & Budget</h3>
                <p className="text-gray-600">When do you need this completed and what's your budget?</p>
            </div>

            {/* Timeline */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    When do you need this completed? *
                </label>
                <div className="space-y-2">
                    {[
                        "ASAP - Within 1-2 weeks",
                        "Soon - Within 1-2 months",
                        "Flexible - 3-6 months",
                        "No rush - 6+ months"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="timeline"
                                value={option}
                                checked={formData.timeline === option}
                                onChange={(e) => handleInputChange('timeline', e.target.value)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
                {validationErrors.timeline && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.timeline}</p>
                )}
            </div>

            {/* Budget */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your budget for this project? *
                </label>
                <div className="space-y-2">
                    {[
                        "Budget-friendly - Looking for the best value",
                        "Standard - Good quality at reasonable price",
                        "Premium - High quality with advanced features",
                        "Enterprise - Top-tier solution with custom features"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="budget"
                                value={option}
                                checked={formData.budget === option}
                                onChange={(e) => handleInputChange('budget', e.target.value)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
                {validationErrors.budget && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.budget}</p>
                )}
            </div>

            {/* Urgency */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    How urgent is this project?
                </label>
                <div className="space-y-2">
                    {[
                        "Very urgent - Need it immediately",
                        "Urgent - Need it soon",
                        "Moderate - Standard timeline is fine",
                        "Not urgent - Can wait"
                    ].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="radio"
                                name="urgency"
                                value={option}
                                checked={formData.urgency === option}
                                onChange={(e) => handleInputChange('urgency', e.target.value)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Step 8: Final Recommendation
export const Step8FinalRecommendation = ({ formData, quote, formatPrice, recommendations }) => {
    const getPackageDescription = (packageType) => {
        switch (packageType) {
            case 'static':
                return 'Perfect for simple information sites and small businesses. Includes 5 pages, contact forms, mobile responsive design, and SEO basics.';
            case 'dynamic':
                return 'Ideal for content-heavy sites and blogs. Includes content management system, blog functionality, user accounts, and advanced features.';
            case 'ecommerce':
                return 'Complete online store solution. Includes product catalog, payment gateways, inventory management, and full e-commerce functionality.';
            default:
                return 'Custom solution tailored to your specific needs.';
        }
    };

    const getPackageName = (packageType) => {
        switch (packageType) {
            case 'static':
                return 'Static Website Package';
            case 'dynamic':
                return 'Dynamic Website Package';
            case 'ecommerce':
                return 'E-commerce Website Package';
            default:
                return 'Custom Package';
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Perfect Website Recommendation</h3>
                <p className="text-gray-600">Based on your answers, here's what we recommend for your business</p>
            </div>

            {/* Confidence Score */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Recommendation Confidence</span>
                    <span className="text-lg font-bold text-blue-900">{formData.confidenceScore}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${formData.confidenceScore}%` }}
                    ></div>
                </div>
            </div>

            {/* Recommended Package */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Package</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="text-lg font-bold text-blue-900 mb-2">
                        {getPackageName(quote.recommendedPackage)}
                    </h4>
                    <p className="text-gray-700 mb-3">{getPackageDescription(quote.recommendedPackage)}</p>
                    <div className="text-2xl font-bold text-blue-900">
                        {formatPrice(quote.basePrice, quote.currency)}
                    </div>
                </div>

                {/* Package Features */}
                <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Included Features:</h5>
                    <ul className="space-y-1">
                        {quote.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recommended Add-ons */}
            {formData.recommendedAddons && formData.recommendedAddons.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Add-ons</h3>
                    <div className="space-y-3">
                        {formData.recommendedAddons.map((addon, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-900">{addon}</span>
                                <span className="text-sm text-gray-600">Recommended</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reasoning */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why This Package?</h3>
                <div className="space-y-3 text-sm text-gray-700">
                    {formData.businessType && (
                        <p><strong>Business Type:</strong> Your {formData.businessType} business requires specific features.</p>
                    )}
                    {formData.contentUpdateFrequency && (
                        <p><strong>Content Needs:</strong> You need {formData.contentUpdateFrequency.toLowerCase()} content updates.</p>
                    )}
                    {formData.userFeatures && formData.userFeatures.length > 0 && (
                        <p><strong>User Features:</strong> You requested {formData.userFeatures.length} user experience features.</p>
                    )}
                    {formData.sellingOnline && formData.sellingOnline.includes('Yes') && (
                        <p><strong>E-commerce:</strong> You plan to sell online, requiring e-commerce functionality.</p>
                    )}
                    {formData.timeline && (
                        <p><strong>Timeline:</strong> Your {formData.timeline.toLowerCase()} timeline fits this package perfectly.</p>
                    )}
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-900 mb-4">Next Steps</h3>
                <div className="space-y-2 text-sm text-green-800">
                    <p>1. Review your recommended package and add-ons</p>
                    <p>2. Submit your project request</p>
                    <p>3. We'll contact you within 24 hours to discuss your project</p>
                    <p>4. Get your custom website built to your specifications</p>
                </div>
            </div>
        </div>
    );
}; 