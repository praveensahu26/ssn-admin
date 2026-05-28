// ============================================================
//  dummyData.js
//  100 accounts: 50 type = "user"  |  50 type = "reporter"
//  All locations are USA-based
// ============================================================

// ─── Shared helpers ──────────────────────────────────────────
const POST_CATEGORIES = [
    "Climate Crisis", "Politics", "Business & Tech", "Sports",
    "Crime & Justice", "Travel", "State & Local", "Education",
    "Health", "Lifestyle", "Food & Travel", "Viral & Trending",
    "Real Estate & Infrastructure", "Startups & Entrepreneurship",
    "Science and Discovery",
];

const pickCategories = (n = 2) => {
    const shuffled = [...POST_CATEGORIES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
};

const portrait = (seed) => `https://images.unsplash.com/photo-${seed}?w=150&h=150&fit=crop&crop=face`;
const cover = (seed) => `https://images.unsplash.com/photo-${seed}?w=900&h=300&fit=crop`;
const postPhoto = (seed) => `https://images.unsplash.com/photo-${seed}?w=800&h=500&fit=crop`;

// ─── 40 Mini-profiles for followers/following ─────────────────
const miniProfiles = [
    { name: "Jordan Hayes", username: "@jordan_h", profilePic: portrait("1535713875002-d1fcc65160e4") },
    { name: "Priya Nair", username: "@priya_n", profilePic: portrait("1494790108377-be9c29b29330") },
    { name: "Marco Bellini", username: "@marco_b", profilePic: portrait("1500648767791-00dcc994a43e") },
    { name: "Sofia Reyes", username: "@sofia_r", profilePic: portrait("1438761681033-6461ffad8d80") },
    { name: "Tyler Brooks", username: "@tyler_b", profilePic: portrait("1472099645785-5658abf4ff4e") },
    { name: "Aisha Coleman", username: "@aisha_c", profilePic: portrait("1489424731084-a5d8b06e4923") },
    { name: "Liam Foster", username: "@liam_f", profilePic: portrait("1527980965255-d3b416303d12") },
    { name: "Camille Dubois", username: "@camille_d", profilePic: portrait("1544005313-94ddf0286df2") },
    { name: "Ethan Park", username: "@ethan_p", profilePic: portrait("1507003211169-0a1dd7228f2d") },
    { name: "Natalia Voss", username: "@natalia_v", profilePic: portrait("1554151228-14d9def656e4") },
    { name: "Diego Romero", username: "@diego_r", profilePic: portrait("1552058544-f2b08422138a") },
    { name: "Zoe Mitchell", username: "@zoe_m", profilePic: portrait("1580489944761-15a19d654956") },
    { name: "Owen Carter", username: "@owen_c", profilePic: portrait("1546961342-ea5f62d5a27a") },
    { name: "Isabelle Grant", username: "@isabelle_g", profilePic: portrait("1521146764736-56c929d59c83") },
    { name: "Noah Rivera", username: "@noah_r", profilePic: portrait("1531746020798-e6953c6e8e04") },
    { name: "Elena Marsh", username: "@elena_m", profilePic: portrait("1573496359142-b8d87734a5a2") },
    { name: "Caleb Turner", username: "@caleb_t", profilePic: portrait("1519085360753-af0119f7cbe7") },
    { name: "Mei-Lin Huang", username: "@meilin_h", profilePic: portrait("1508214751196-bcfd4ca60f91") },
    { name: "Jasper Williams", username: "@jasper_w", profilePic: portrait("1557862921-37829c790f19") },
    { name: "Rosa Espinoza", username: "@rosa_e", profilePic: portrait("1487412720507-e7ab37603c6f") },
    { name: "Felix Hartmann", username: "@felix_h", profilePic: portrait("1506794778202-cad84cf45f1d") },
    { name: "Amara Diallo", username: "@amara_d", profilePic: portrait("1519345182560-3f2917c472d6") },
    { name: "Brendan Walsh", username: "@brendan_w", profilePic: portrait("1542909168-82c89c0a2bb7") },
    { name: "Yuki Mori", username: "@yuki_m", profilePic: portrait("1528892952291-009c663ce843") },
    { name: "Selena Torres", username: "@selena_t", profilePic: portrait("1560250097-0b93528c311a") },
    { name: "Kai Nakamura", username: "@kai_n", profilePic: portrait("1531727096-f3b7b5c16842") },
    { name: "Grace Okafor", username: "@grace_o", profilePic: portrait("1508214751196-bcfd4ca60f91") },
    { name: "Hugo Lemaire", username: "@hugo_l", profilePic: portrait("1519085360753-af0119f7cbe7") },
    { name: "Nia Adeyemi", username: "@nia_a", profilePic: portrait("1580489944761-15a19d654956") },
    { name: "Soren Lindberg", username: "@soren_l", profilePic: portrait("1552058544-f2b08422138a") },
    { name: "Tasha Williams", username: "@tasha_w", profilePic: portrait("1494790108377-be9c29b29330") },
    { name: "Rafael Costa", username: "@rafael_c", profilePic: portrait("1500648767791-00dcc994a43e") },
    { name: "Ingrid Solvay", username: "@ingrid_s", profilePic: portrait("1438761681033-6461ffad8d80") },
    { name: "Kwame Asante", username: "@kwame_a", profilePic: portrait("1472099645785-5658abf4ff4e") },
    { name: "Lily Chen", username: "@lily_c", profilePic: portrait("1544005313-94ddf0286df2") },
    { name: "Darius Ford", username: "@darius_f", profilePic: portrait("1554151228-14d9def656e4") },
    { name: "Mia Kovacs", username: "@mia_k", profilePic: portrait("1573496359142-b8d87734a5a2") },
    { name: "Theo Marchand", username: "@theo_m", profilePic: portrait("1531746020798-e6953c6e8e04") },
    { name: "Priscilla Hunt", username: "@priscilla_h", profilePic: portrait("1521146764736-56c929d59c83") },
    { name: "Cyrus Tehrani", username: "@cyrus_t", profilePic: portrait("1546961342-ea5f62d5a27a") },
];

const getMini = (indices) => indices.map((i) => miniProfiles[i % miniProfiles.length]);

// ─── 20 Comments ─────────────────────────────────────────────
const commentBank = [
    { text: "This is such an important story—grateful someone is finally covering it in depth!", time: "12m", likeCount: "2.3K" },
    { text: "Hard to believe this is still happening in 2024. We need real change, not just headlines.", time: "34m", likeCount: "5.1K" },
    { text: "Great reporting! I shared this with my entire team. Everyone should read this piece.", time: "1h", likeCount: "1.8K" },
    { text: "The facts here are alarming. I hope lawmakers are paying close attention to what's unfolding.", time: "2h", likeCount: "9.4K" },
    { text: "My heart goes out to everyone affected. We stand with you through this difficult time.", time: "45m", likeCount: "3.7K" },
    { text: "Balanced and well-researched. This is exactly the kind of journalism our society desperately needs.", time: "58m", likeCount: "6.2K" },
    { text: "I never knew about this issue until I read this post. Incredibly eye-opening content.", time: "3h", likeCount: "880" },
    { text: "The local government needs to step up. This has been ignored for far too long.", time: "22m", likeCount: "4.5K" },
    { text: "Sharing immediately. Everyone in my city needs to see this right now!", time: "7m", likeCount: "1.1K" },
    { text: "Powerful words and strong evidence. Keep up the outstanding work on this story!", time: "1h 15m", likeCount: "7.6K" },
    { text: "Finally someone is talking about this. I have been waiting for coverage like this for months.", time: "19m", likeCount: "3.2K" },
    { text: "This story deserves way more attention than it is currently getting. Please share widely.", time: "2h 30m", likeCount: "8.9K" },
    { text: "As someone directly affected by this issue, I cannot thank you enough for telling our story.", time: "55m", likeCount: "12.1K" },
    { text: "The data presented here is staggering. We need policy action and we need it immediately.", time: "4h", likeCount: "2.8K" },
    { text: "This is the kind of reporting that restores my faith in journalism. Genuinely well done.", time: "1h 45m", likeCount: "6.7K" },
    { text: "I read this three times. Every paragraph is packed with information that matters deeply.", time: "31m", likeCount: "1.4K" },
    { text: "Sent this to my senator. Every elected official needs to be aware of what is happening.", time: "6h", likeCount: "5.5K" },
    { text: "The community deserves better and this report makes that undeniably clear to everyone.", time: "48m", likeCount: "4.1K" },
    { text: "Brave reporting. This story could not have been easy to research and tell. Thank you.", time: "2h 10m", likeCount: "9.8K" },
    { text: "I am going to use this in my classroom. My students need to understand these issues now.", time: "1h 20m", likeCount: "2.0K" },
];

const makeComments = (postIdx) =>
    Array.from({ length: 3 }, (_, i) => {
        const mini = miniProfiles[(postIdx + i * 3) % miniProfiles.length];
        const c = commentBank[(postIdx + i) % commentBank.length];
        return {
            commentedUserUsername: mini.username,
            userProfilePic: mini.profilePic,
            commentText: c.text,
            commentTime: c.time,
            commentLikeCount: c.likeCount,
        };
    });

const makeLikes = (postIdx) =>
    Array.from({ length: 5 }, (_, i) => {
        const mini = miniProfiles[(postIdx + i * 7) % miniProfiles.length];
        return { userProfilePic: mini.profilePic, userName: mini.name, username: mini.username };
    });

// ─── 60 Post titles ──────────────────────────────────────────
const postTitles = [
    "Rising sea levels threaten coastal communities across the entire eastern United States seaboard.",
    "New legislation could reshape healthcare access for millions of underserved American families.",
    "Silicon Valley startup raises record funding amid growing concerns about artificial intelligence.",
    "Local school district faces budget cuts threatening arts and music programs for students.",
    "Police reform activists march downtown demanding accountability and transparent community oversight.",
    "Championship finals draw record viewership as hometown team battles for the national title.",
    "Hidden dangers lurk in everyday household products, new consumer safety report reveals today.",
    "City council approves controversial rezoning plan dividing longtime neighbors in historic district.",
    "Groundbreaking medical trial offers new hope to patients living with rare chronic diseases.",
    "Food banks across the country struggle to keep shelves stocked amid rising inflation.",
    "Tech giant announces massive layoffs affecting thousands of employees across multiple global offices.",
    "Wildfire season arrives early, prompting evacuations in several drought-stricken western states.",
    "Local entrepreneur turns pandemic hobby into thriving business employing dozens in the community.",
    "Scientists discover new deep-sea species never before documented in any published research.",
    "College tuition rises again as student loan debt reaches a staggering all-time national high.",
    "Community garden project transforms abandoned lot into vibrant neighborhood gathering and food space.",
    "State election results trigger recount as margin between candidates falls below half a percent.",
    "Housing market cools slightly but affordability remains out of reach for most first-time buyers.",
    "New airport terminal opens bringing thousands of jobs and improved connectivity to the region.",
    "Youth mental health crisis deepens as schools report record counseling service referral numbers.",
    "Renewable energy project will power ten thousand homes using wind turbines along the coast.",
    "Local chef wins national award elevating regional cuisine to the international culinary spotlight.",
    "Bridge infrastructure failing across dozens of counties according to new federal safety assessment.",
    "Documentary filmmaker captures untold story of migrant farmworkers feeding the entire nation daily.",
    "Historic museum announces major expansion funded by record-breaking community donation campaign.",
    "Water quality crisis worsens as regulators debate long-term solutions for aging pipe infrastructure.",
    "Animal shelter reaches capacity urging residents to consider adoption before the holiday season.",
    "Startup accelerator program opens applications for underrepresented founders across all fifty states.",
    "Earthquake preparedness drill exposes critical gaps in city emergency response planning systems.",
    "Viral dance challenge raises surprising awareness for overlooked childhood literacy funding crisis.",
    "Federal budget proposal threatens funding for community health clinics serving low-income patients.",
    "Local transit authority unveils electric bus fleet replacing aging diesel vehicles across the city.",
    "Native American tribe wins landmark legal battle over ancestral land rights in federal court.",
    "Record-breaking heat wave forces school closures and emergency cooling center activations statewide.",
    "Independent bookstores make surprising comeback as readers seek curated shopping experiences locally.",
    "Urban farming initiative turns rooftops into productive gardens feeding hundreds of families weekly.",
    "New study reveals alarming disparities in maternal health outcomes across racial and income lines.",
    "Small business owners rally against proposed zoning changes threatening commercial districts downtown.",
    "High school robotics team makes national headlines after winning first-ever championship competition.",
    "Investigative report exposes illegal dumping of industrial waste in low-income neighborhood waterways.",
    "City opens first dedicated mental health urgent care center to reduce emergency room overcrowding.",
    "Local union votes to strike after contract negotiations with major employer collapse overnight.",
    "Scientists warn of accelerating glacier melt with major implications for freshwater supply nationwide.",
    "Community college partners with tech companies to offer free coding bootcamps for unemployed adults.",
    "Historic neighborhood faces demolition threat as developer seeks permits for high-rise construction.",
    "Public library system launches digital literacy program targeting seniors in underserved communities.",
    "Grassroots campaign succeeds in blocking construction of industrial facility near residential area.",
    "Award-winning teacher develops revolutionary curriculum now being adopted across five states nationwide.",
    "Report finds widespread food deserts persist in urban cores despite years of policy interventions.",
    "Drone delivery pilot program launches in rural counties where traditional shipping remains unreliable.",
    "New pedestrian bridge connects two long-divided neighborhoods sparking revitalization and new commerce.",
    "Federal grant funds expansion of after-school programs in twenty underserved school districts.",
    "Cycling infrastructure overhaul transforms dangerous arterial road into family-friendly greenway corridor.",
    "Nonprofit launches tool lending library giving low-income homeowners access to repair equipment.",
    "Local orchestra performs free outdoor concerts drawing thousands to reclaim public park spaces.",
    "Pediatric hospital opens new wing dedicated entirely to childhood cancer research and treatment.",
    "Weatherization program helps low-income families cut energy bills by up to sixty percent annually.",
    "Community land trust model gains traction as cities search for affordable housing solutions.",
    "First-generation immigrants launch cultural newspaper preserving heritage and informing new arrivals.",
    "Solar panel cooperative allows renters to access clean energy benefits for the very first time.",
];

// ─── 20 Post descriptions ─────────────────────────────────────
const postDescriptions = [
    "Communities along the eastern seaboard are bracing for unprecedented flooding as sea levels continue rising at alarming rates. Experts warn that without immediate intervention, thousands of homes could be permanently underwater within the next two decades.",
    "A sweeping new bill introduced in Congress aims to expand Medicaid coverage to rural areas long neglected by existing healthcare infrastructure. Advocates say the change could benefit over four million uninsured Americans if passed.",
    "Venture capitalists poured a staggering two billion dollars into an AI startup this quarter, signaling continued investor confidence despite mounting regulatory scrutiny and growing public debate about ethical implications.",
    "Parents and teachers rallied outside city hall as district officials announced plans to eliminate funding for visual arts and music programs, citing a thirty-million-dollar budget shortfall affecting the entire district.",
    "Hundreds gathered peacefully in the city center, calling for sweeping police reforms including body camera mandates, civilian oversight boards, and independent investigation units for use-of-force complaints.",
    "In a nail-biting game that went into double overtime, the home team secured their spot in the championship finals, sending fans into a frenzy of celebration that spilled into the streets for hours.",
    "A new report from the Consumer Safety Commission has identified carcinogenic compounds in over a dozen popular cleaning products sold in major retail chains nationwide, prompting urgent calls for a product recall.",
    "After months of heated debate, the city council voted six to three in favor of a controversial rezoning plan that critics say will accelerate gentrification and displace long-time residents in the historic neighborhood.",
    "Researchers at a leading university hospital have launched a promising clinical trial targeting a rare autoimmune disorder, offering renewed hope to thousands of patients who have exhausted all existing treatment options.",
    "Food banks from coast to coast are sounding the alarm as donation rates fall sharply while demand continues climbing. Directors warn that without emergency funding, they may be forced to reduce distribution days.",
    "A landmark federal budget proposal released this week would slash funding for over three hundred community health clinics, leaving an estimated two million patients without access to primary care services.",
    "The city's new electric bus fleet represents a forty-million-dollar investment in cleaner public transit. Officials say the switch will eliminate over twelve thousand tons of carbon emissions annually.",
    "After a decade-long legal battle, the tribe was awarded full sovereignty over nearly eighty thousand acres of ancestral land in a ruling that legal scholars are calling one of the most significant in modern history.",
    "Temperatures exceeding one hundred and ten degrees forced the closure of over two hundred public schools this week as emergency officials scrambled to open cooling centers in community centers and libraries.",
    "Independent bookstores have seen a twenty-two percent sales increase over the past two years, a trend that industry analysts attribute to readers seeking personalized recommendations and community connection.",
    "Rooftop gardens spread across twelve city blocks are now producing over three tons of fresh vegetables per month, providing affordable produce directly to residents in a neighborhood classified as a food desert.",
    "A groundbreaking study published in a leading medical journal found that Black women face a mortality rate three times higher during childbirth than white women, regardless of income or education level.",
    "Dozens of small business owners packed a city planning meeting to oppose proposed zoning changes that would reclassify commercial corridors and effectively price out longtime tenants and independent retailers.",
    "The Westfield High robotics team captured the national championship in a competition featuring over three hundred teams, putting their small rust-belt city on the map for STEM excellence.",
    "An eighteen-month investigation has uncovered a systematic pattern of illegal dumping by a chemical manufacturer, with evidence of contamination spreading to groundwater sources serving over fifty thousand residents.",
];

// ─── 40 Post times ───────────────────────────────────────────
const postTimes = [
    "23m ago", "1h 12m ago", "2h 45m ago", "34m ago", "5h ago",
    "1d ago", "3h 20m ago", "48m ago", "6h 15m ago", "2d ago",
    "15m ago", "4h ago", "1h 55m ago", "3d ago", "7h 30m ago",
    "52m ago", "1h 38m ago", "2h 10m ago", "4d ago", "11h ago",
    "28m ago", "5h 45m ago", "1h 5m ago", "2d ago", "9h 20m ago",
    "37m ago", "6h ago", "3h 15m ago", "1d ago", "43m ago",
    "8m ago", "10h ago", "1h 50m ago", "5d ago", "3h 40m ago",
    "1h 25m ago", "2h 55m ago", "6d ago", "14h ago", "20m ago",
];

// ─── 30 Post locations ───────────────────────────────────────
const postLocations = [
    "Miami, Florida", "New York, New York", "Los Angeles, California",
    "Chicago, Illinois", "Houston, Texas", "Phoenix, Arizona",
    "Philadelphia, Pennsylvania", "San Antonio, Texas", "San Diego, California",
    "Dallas, Texas", "Austin, Texas", "Jacksonville, Florida",
    "Columbus, Ohio", "Charlotte, North Carolina", "San Francisco, California",
    "Indianapolis, Indiana", "Seattle, Washington", "Denver, Colorado",
    "Nashville, Tennessee", "Boston, Massachusetts", "Portland, Oregon",
    "Las Vegas, Nevada", "Memphis, Tennessee", "Atlanta, Georgia",
    "Baltimore, Maryland", "Louisville, Kentucky", "Milwaukee, Wisconsin",
    "Albuquerque, New Mexico", "Tucson, Arizona", "Sacramento, California",
];

// ─── 40 Photo seeds ──────────────────────────────────────────
const photoSeeds = [
    "1465146344240-a2dbf5c7b027", "1504711434969-e33886168f5c", "1488590528505-98d2b5aba04b",
    "1526948128573-703ee1aeb6fa", "1551836022-4196f83abcec", "1464822759023-fed622ff2c3b",
    "1503676260728-1c00da094a0b", "1477959858617-67f85cf4f1a2", "1562774053-0ef85b163c2d",
    "1495020689067-958852a7765e", "1499678567675-2bba5f5e4b1e", "1541963463532-d153efff33ef",
    "1486312338219-ce68d2c6f44d", "1543286386-713bdd548da4", "1518770660439-4636190af475",
    "1517694712202-14dd9538aa97", "1607082348824-0a96f2a4b9da", "1555212697-194d15aa18cf",
    "1511707171634-56260b214de0", "1508739773434-c26b3d09e071", "1558618666-fcd25c85cd64",
    "1515879218367-8466d910aaa4", "1509718443690-d8e2fb3474b7", "1564410267841-915d8e4d71ea",
    "1587574293340-e0011c4e8ecf", "1528360983277-13d401cdc186", "1495653797063-3c16de5a1d2e",
    "1562408590-e32931084e23", "1611162617213-7d7a39e9b1d7", "1531727096-f3b7b5c16842",
    "1473081556163-be14d275a2e8", "1477414348822-d1cbd4c95da2", "1530541930197-ff16a3eaed18",
    "1527525443983-6e60c75fff46", "1544551763-46a013bb70d5", "1500462918776-62e7b24d01ec",
    "1469854523086-cc02fe5d8800", "1493707778029-39c84c66e31e", "1458682625221-3a62f97ccf15",
    "1488161436001-b4d4bf6b5f08",
];

// ─── Post factory ─────────────────────────────────────────────
const makePosts = (userIdx) =>
    Array.from({ length: 30 }, (_, i) => {
        const seed = photoSeeds[(userIdx * 7 + i) % photoSeeds.length];
        const cats = pickCategories(1 + (i % 2));
        return {
            id: `post_u${userIdx}_${i + 1}`,
            mediaType: i % 4 === 0 ? "video" : "photo",
            mediaUrl: postPhoto(seed),
            viewCount: `${((userIdx * 3 + i * 17) % 900) + 100}K`,
            postTime: postTimes[(userIdx + i) % postTimes.length],
            title: postTitles[(userIdx + i) % postTitles.length],
            likeCount: `${((i * 13 + userIdx * 5) % 90) + 1}.${(i * 7) % 9}K`,
            commentCount: `${((i * 11 + userIdx * 3) % 40) + 1}.${(i * 3) % 9}K`,
            shareCount: `${((i * 7 + userIdx) % 9) + 1}.${(i * 4) % 9}K`,
            description: postDescriptions[(userIdx + i) % postDescriptions.length],
            location: `${postLocations[(userIdx + i) % postLocations.length]}, America`,
            categories: cats,
            comments: makeComments(userIdx * 30 + i),
            likes: makeLikes(userIdx * 30 + i),
        };
    });

// ─── 40 Campaign titles ───────────────────────────────────────
const campaignTitles = [
    "Fire at Local School—Your Support Can Bring Relief.",
    "Flood Survivors Need Us—Help Rebuild Their Homes Today.",
    "Clean Water for Lakewood: Fund the New Pipeline Now.",
    "After the Storm: Restore Power to Rural Virginia Families.",
    "Books & Backpacks Drive for Under-Resourced Urban Schools.",
    "Veterans' Housing Crisis—Help Our Heroes Find Shelter.",
    "Save the Community Center: 40 Years of Service at Risk.",
    "Medical Bills Crushing a Family of Five—Stand With Them.",
    "Reforest Our Mountains: Plant 10,000 Trees This Season.",
    "Immigrant Families Await Justice—Fund Their Legal Defense.",
    "Emergency Food Relief for Tornado-Ravaged Midwest Towns.",
    "Tech Lab for Underprivileged Youth—Open the Digital Door.",
    "Local Animal Shelter Expansion—More Rooms, More Lives Saved.",
    "Scholarships for First-Generation College Students Now.",
    "Mental Health Clinics for Rural Communities Desperately Needed.",
    "Restore the Historic Downtown Mural—Preserve Our Heritage.",
    "Disaster Relief: Wildfire Families Need Your Help Tonight.",
    "Community Pool Reopening—Safe Summer for Every Child.",
    "Senior Citizens' Nutrition Program Facing Funding Cuts.",
    "Youth Soccer League Needs Equipment and Field Repairs Now.",
    "Rebuild the Community Library After Devastating Flooding.",
    "Free Dental Clinic Bus Needs Funding to Serve Rural Towns.",
    "Transgender Youth Support Center Urgently Needs Your Help.",
    "Help Us Feed Three Hundred Homeless Families This Winter.",
    "Restore Safe Drinking Water to the Navajo Nation Community.",
    "Single Father of Four Battles Medical Debt—Please Help.",
    "Wheelchair Ramp Fund: Make Our Neighborhood Fully Accessible.",
    "Fund the After-School Music Program Facing Imminent Closure.",
    "Hurricane Survivors Need Roofing Materials Before Winter Arrives.",
    "Digital Devices for Foster Youth Aging Out of the System.",
    "Revive Our Farmers Market—A Hub of Local Food and Commerce.",
    "Support Women Fleeing Domestic Violence—Shelter Needs Funding.",
    "Save the Wetlands: Stop Industrial Runoff Before It's Too Late.",
    "First Responder Family Lost Everything in a House Fire.",
    "Fund Eyeglasses for Three Hundred Kids Who Cannot See Clearly.",
    "Community Fridge Network Expanding to Ten New Neighborhoods.",
    "Help Rebuild the Playground Destroyed in Last Month's Storm.",
    "Refugee Family Resettlement Fund—Help Them Start Fresh Here.",
    "Solar Panels for Low-Income Seniors to Cut Their Energy Bills.",
    "Emergency Vet Fund: Save the Animals at Our Underfunded Shelter.",
];

// ─── 20 Campaign descriptions ─────────────────────────────────
const campaignDescriptions = [
    "A devastating fire has struck our local school, causing significant damage to classrooms and essential supplies. Students and staff are in urgent need of support to rebuild and recover. Your contributions will help restore learning spaces, provide materials, and offer emotional support to those affected. Let us unite and bring hope back to our community!",
    "Severe flooding has displaced dozens of families who lost everything in a matter of hours. We are raising funds to provide temporary shelter, clean clothing, and essential household items. Every dollar donated goes directly to families waiting to return home safely. Please give what you can and share this campaign widely.",
    "Contaminated water has been a crisis in Lakewood for over two years. We are funding the construction of a modern filtration pipeline to deliver clean, safe drinking water to over three thousand residents. This campaign has already gained attention from state legislators and your donation puts real pressure on officials to act.",
    "After a powerful storm knocked out power across rural Virginia, dozens of elderly and low-income families are without electricity or heat. Funds raised will cover generator rentals, utility restoration costs, and emergency supply kits for the most vulnerable households in the affected region.",
    "Thousands of students in under-resourced schools start the year without basic supplies. This campaign delivers backpacks, notebooks, pens, and essential reading materials to children who need them most. With your help, we can ensure every child walks into class on the first day feeling prepared and confident.",
    "Hundreds of veterans in our city are sleeping on the streets despite their service to our nation. This campaign funds transitional housing units, mental health counseling, and job placement services designed specifically for homeless veterans. No one who fought for our freedom should be left without a roof over their head.",
    "Our beloved community center has served families for four decades, offering after-school programs, senior activities, and crisis counseling. Facing severe budget cuts, the center risks permanent closure by the end of this fiscal year. Help us keep the doors open and the lights on for generations to come.",
    "A single mother of five is drowning in medical debt after a cancer diagnosis last spring. She has exhausted her insurance and savings trying to keep her family together during treatment. Every contribution provides direct financial relief to cover hospital bills, rent, and groceries for this remarkable family.",
    "Decades of deforestation have left our mountain ecosystem vulnerable to erosion and climate change. This campaign plants ten thousand native trees across degraded slopes, restoring wildlife habitat and improving local water quality. Volunteers are ready—we just need the funding to purchase and plant every sapling.",
    "Hundreds of immigrant families are facing deportation without legal representation. This campaign funds experienced immigration attorneys, court filing fees, and translation services for families navigating the complex US immigration system alone. Justice should not depend on how much money you have in your pocket.",
    "The flooding last spring destroyed over eighty percent of the library's collection and damaged the roof beyond repair. We are raising funds to restore the building, replace lost books, and reopen a space that serves as a lifeline for thousands of students, job seekers, and seniors in this community.",
    "Our mobile dental clinic bus brings free oral health care to rural communities that have no access to dental services. The vehicle needs major repairs and new equipment to continue serving over two thousand patients annually. Your donation directly funds the care these families have nowhere else to receive.",
    "Our local support center provides safe housing, counseling, and community for transgender youth facing rejection at home. We are facing a funding shortfall that threatens to close our doors. Every dollar raised goes toward keeping the lights on and making sure no young person has to face this alone.",
    "With shelter beds at capacity and temperatures dropping rapidly, three hundred homeless families in our city need immediate help. This campaign provides emergency food boxes, blankets, hygiene kits, and hotel vouchers for the families most at risk this winter. Speed matters—please donate and share today.",
    "For decades the Navajo Nation community of Red Mesa has survived on water hauled in trucks because their pipes are contaminated. This campaign funds the final phase of a clean water pipeline bringing safe running water directly into homes for the first time in the community's modern history.",
    "Marcus is a single father of four working two jobs while battling a serious illness. His medical debt has reached levels that threaten his family's housing and stability. Every contribution provides direct relief and lets Marcus focus on recovering and being present for his children during this crisis.",
    "Fourteen businesses and forty-seven residences in our neighborhood are still inaccessible to wheelchair users. This campaign funds the design and construction of curb cuts, ramps, and accessible pathways that will transform our neighborhood into a place where everyone can move freely and with full dignity.",
    "The after-school music program at Jefferson Middle School has served students for twenty years. Budget cuts have given it thirty days to raise matching funds or close permanently. Music education reduces dropout rates and builds lifelong skills. Help us keep these instruments in these students' hands today.",
    "Hurricane survivors in our coastal community are living under blue tarps with winter approaching fast. This campaign purchases and delivers roofing materials, connects families with volunteer labor crews, and ensures no family enters the cold season without a sealed roof over their heads. Please act now.",
    "Every year thousands of foster youth age out of the system without a phone, laptop, or internet connection. This campaign provides refurbished devices and one year of data plans to young adults transitioning out of foster care, giving them the tools to apply for jobs, housing, and educational programs.",
];

const campaignStatuses = ["active", "completed", "suspended"];

// ─── 20 Campaign category sets ────────────────────────────────
const campaignCategories = [
    ["Education", "Disaster", "Help", "Funding"],
    ["Housing", "Relief", "Community", "Families"],
    ["Environment", "Water", "Health", "Infrastructure"],
    ["Emergency", "Veterans", "Support", "Housing"],
    ["Youth", "Education", "Sports", "Local"],
    ["Animals", "Rescue", "Community", "Welfare"],
    ["Healthcare", "Mental Health", "Rural", "Support"],
    ["Heritage", "Arts", "Culture", "Restoration"],
    ["Wildfire", "Disaster", "Relief", "Families"],
    ["Food", "Seniors", "Nutrition", "Community"],
    ["Library", "Education", "Flood", "Recovery"],
    ["Dental", "Health", "Rural", "Access"],
    ["LGBTQ", "Youth", "Housing", "Support"],
    ["Homeless", "Food", "Winter", "Emergency"],
    ["Indigenous", "Water", "Rights", "Infrastructure"],
    ["Medical", "Family", "Debt", "Relief"],
    ["Accessibility", "Disability", "Infrastructure", "Community"],
    ["Music", "Education", "Youth", "Arts"],
    ["Hurricane", "Disaster", "Housing", "Rebuild"],
    ["Foster Youth", "Technology", "Education", "Transition"],
];

// ─── 20 Campaign locations ────────────────────────────────────
const campaignLocations = [
    "Greenwood Elementary School, America",
    "Bayou Vista, Louisiana, America",
    "Lakewood Township, New Jersey, America",
    "Shenandoah Valley, Virginia, America",
    "South Side Chicago, Illinois, America",
    "Downtown Memphis, Tennessee, America",
    "East Oakland, California, America",
    "Bronx, New York, America",
    "Blue Ridge Mountains, North Carolina, America",
    "El Paso, Texas, America",
    "Joplin, Missouri, America",
    "West Baltimore, Maryland, America",
    "Tucson, Arizona, America",
    "Flint, Michigan, America",
    "Red Mesa, Navajo Nation, America",
    "Gary, Indiana, America",
    "Savannah, Georgia, America",
    "Harlem, New York, America",
    "Pensacola, Florida, America",
    "Stockton, California, America",
];

// ─── 10 Fundraising team sets ─────────────────────────────────
const campaignFundraisingTeams = [
    [
        { profilePic: portrait("1535713875002-d1fcc65160e4"), name: "Jordan Hayes", amountRaised: "$4,200" },
        { profilePic: portrait("1494790108377-be9c29b29330"), name: "Priya Nair", amountRaised: "$3,800" },
        { profilePic: portrait("1500648767791-00dcc994a43e"), name: "Marco Bellini", amountRaised: "$2,950" },
    ],
    [
        { profilePic: portrait("1438761681033-6461ffad8d80"), name: "Sofia Reyes", amountRaised: "$5,100" },
        { profilePic: portrait("1472099645785-5658abf4ff4e"), name: "Tyler Brooks", amountRaised: "$1,750" },
    ],
    [
        { profilePic: portrait("1489424731084-a5d8b06e4923"), name: "Aisha Coleman", amountRaised: "$6,300" },
        { profilePic: portrait("1527980965255-d3b416303d12"), name: "Liam Foster", amountRaised: "$2,400" },
        { profilePic: portrait("1544005313-94ddf0286df2"), name: "Camille Dubois", amountRaised: "$3,150" },
    ],
    [
        { profilePic: portrait("1507003211169-0a1dd7228f2d"), name: "Ethan Park", amountRaised: "$4,700" },
        { profilePic: portrait("1554151228-14d9def656e4"), name: "Natalia Voss", amountRaised: "$2,200" },
    ],
    [
        { profilePic: portrait("1552058544-f2b08422138a"), name: "Diego Romero", amountRaised: "$3,500" },
        { profilePic: portrait("1580489944761-15a19d654956"), name: "Zoe Mitchell", amountRaised: "$4,900" },
        { profilePic: portrait("1546961342-ea5f62d5a27a"), name: "Owen Carter", amountRaised: "$1,600" },
    ],
    [
        { profilePic: portrait("1506794778202-cad84cf45f1d"), name: "Felix Hartmann", amountRaised: "$5,400" },
        { profilePic: portrait("1519345182560-3f2917c472d6"), name: "Amara Diallo", amountRaised: "$3,100" },
    ],
    [
        { profilePic: portrait("1542909168-82c89c0a2bb7"), name: "Brendan Walsh", amountRaised: "$2,800" },
        { profilePic: portrait("1528892952291-009c663ce843"), name: "Yuki Mori", amountRaised: "$1,950" },
        { profilePic: portrait("1560250097-0b93528c311a"), name: "Selena Torres", amountRaised: "$4,200" },
    ],
    [
        { profilePic: portrait("1531727096-f3b7b5c16842"), name: "Kai Nakamura", amountRaised: "$3,700" },
        { profilePic: portrait("1508214751196-bcfd4ca60f91"), name: "Grace Okafor", amountRaised: "$2,100" },
    ],
    [
        { profilePic: portrait("1519085360753-af0119f7cbe7"), name: "Hugo Lemaire", amountRaised: "$6,800" },
        { profilePic: portrait("1580489944761-15a19d654956"), name: "Nia Adeyemi", amountRaised: "$4,300" },
        { profilePic: portrait("1552058544-f2b08422138a"), name: "Soren Lindberg", amountRaised: "$2,650" },
    ],
    [
        { profilePic: portrait("1494790108377-be9c29b29330"), name: "Tasha Williams", amountRaised: "$3,900" },
        { profilePic: portrait("1500648767791-00dcc994a43e"), name: "Rafael Costa", amountRaised: "$2,400" },
    ],
];

// ─── 16 Words of support entries ─────────────────────────────
const wordsOfSupportBank = [
    { name: "Amanda Cerny", donatedAmount: "$300", text: "I can only imagine the fear and loss these children and teachers must feel. I hope my contribution helps restore their sense of safety and normalcy. Stay strong!" },
    { name: "Marcus Webb", donatedAmount: "$150", text: "This community deserves every ounce of support we can give. Donated on behalf of my entire family. Rebuilding takes time but together we will get there." },
    { name: "Tina Morales", donatedAmount: "$500", text: "No family should face this kind of devastation alone. Every dollar I give represents the belief that our community is stronger together than any disaster." },
    { name: "Derek Osei", donatedAmount: "$75", text: "Small donation but it comes with my biggest prayers. I grew up in a community like this and know how much every single contribution truly matters." },
    { name: "Grace Yuen", donatedAmount: "$250", text: "These stories remind me how fragile and precious our communities are. I am glad there is a platform where people can come together and help so easily." },
    { name: "Samuel Knight", donatedAmount: "$400", text: "Donating because I believe in this cause deeply. Let us make sure every affected family knows they are seen, supported, and surrounded by love and care." },
    { name: "Fatima Okafor", donatedAmount: "$200", text: "Heartbroken to see this but hopeful because of the outpouring of support. This is what true community looks like. I am proud to be part of this effort." },
    { name: "Luke Patterson", donatedAmount: "$100", text: "Shared this campaign with my coworkers and several of them donated too. The ripple effect of kindness is real. Keep pushing and do not give up hope." },
    { name: "Rachel Kim", donatedAmount: "$350", text: "This cause speaks directly to my heart. I have seen firsthand how donations like this change lives permanently. Thank you for organizing this campaign." },
    { name: "Omar Shaikh", donatedAmount: "$180", text: "Every child deserves safety, every family deserves dignity. Proud to contribute and I will keep sharing until this campaign hits its goal completely." },
    { name: "Bianca Ferrero", donatedAmount: "$420", text: "I donated in honor of my late mother who believed deeply in community service. This is exactly the kind of campaign she would have championed loudly." },
    { name: "Elijah Monroe", donatedAmount: "$90", text: "Even a small amount adds up when enough people care. I encouraged my whole neighborhood group to donate. Together we are unstoppable as a community." },
    { name: "Yara Saleh", donatedAmount: "$275", text: "Seeing how quickly this campaign has grown gives me real hope. People are fundamentally good and want to help when they know where the need truly is." },
    { name: "Nathan Oguike", donatedAmount: "$130", text: "Donated immediately after reading the story. Sharing it with every person I know. No one in our community should have to face this kind of crisis alone." },
    { name: "Claire Beaumont", donatedAmount: "$600", text: "This is the largest donation I have ever made to a campaign. The need is urgent, the cause is just, and I trust this organization completely to deliver." },
    { name: "Cyrus Tehrani", donatedAmount: "$215", text: "I appreciate the transparency of this campaign. Knowing exactly where my money goes makes me confident and happy to give as much as I possibly can." },
];

const makeWordsOfSupport = (idx) =>
    Array.from({ length: 3 }, (_, i) => {
        const w = wordsOfSupportBank[(idx + i) % wordsOfSupportBank.length];
        const mini = miniProfiles[(idx + i * 5) % miniProfiles.length];
        return {
            userProfilePic: mini.profilePic,
            userName: w.name,
            donatedAmount: w.donatedAmount,
            words: w.text,
        };
    });

const makeCampaigns = (userIdx, count) =>
    Array.from({ length: count }, (_, i) => {
        const seed = photoSeeds[(userIdx * 11 + i * 3) % photoSeeds.length];
        const goalAmt = ((userIdx * 5 + i * 13) % 90 + 10) * 1000;
        const raisedAmt = Math.floor(goalAmt * (0.4 + ((userIdx + i) % 6) * 0.1));
        const donations = ((userIdx * 7 + i * 11) % 900) + 50;
        return {
            id: `campaign_u${userIdx}_${i + 1}`,
            mediaType: i % 3 === 0 ? "video" : "photo",
            mediaUrl: postPhoto(seed),
            viewCount: `${((userIdx * 3 + i * 19) % 9) + 1}.${(i * 4) % 9}K`,
            postTime: postTimes[(userIdx * 2 + i) % postTimes.length],
            status: campaignStatuses[(userIdx + i) % campaignStatuses.length],
            title: campaignTitles[(userIdx + i) % campaignTitles.length],
            description: campaignDescriptions[(userIdx + i) % campaignDescriptions.length],
            amountGoal: `$${goalAmt.toLocaleString()} Goal`,
            raisedAmount: `$${raisedAmt.toLocaleString()} Raised`,
            donationCount: `${donations} Donations`,
            location: campaignLocations[(userIdx + i) % campaignLocations.length],
            categories: campaignCategories[(userIdx + i) % campaignCategories.length],
            fundraisingTeam: campaignFundraisingTeams[(userIdx + i) % campaignFundraisingTeams.length],
            wordsOfSupport: makeWordsOfSupport(userIdx * 10 + i),
        };
    });

// ─── Block / Suspend reasons (10 each) ───────────────────────
const blockReasons = [
    "This account was found repeatedly posting misleading information and harassing other users through direct messages and public comment threads.",
    "Multiple verified reports of spam behavior, including mass-following and automated posting, violating platform community guidelines.",
    "Account engaged in coordinated inauthentic behavior, creating fake engagement and artificially boosting unverified news content.",
    "User shared personally identifiable information of another member without consent, constituting a serious privacy violation.",
    "Content promoting hate speech and targeted harassment toward a specific demographic group was detected on this account.",
    "Account was found operating multiple duplicate profiles in violation of the platform's single-account identity policy.",
    "User repeatedly circumvented content moderation filters by posting prohibited material using coded language and images.",
    "Verified reports indicate this account was used to orchestrate targeted harassment campaigns against multiple journalists.",
    "Account shared fabricated screenshots falsely attributing statements to public figures, causing measurable reputational harm.",
    "Pattern of fraudulent fundraising activity was detected, with campaign funds allegedly redirected to personal accounts.",
];

const suspendReasons = [
    "Temporary suspension pending investigation into reported violations of the platform's content authenticity and disclosure policies.",
    "Account under review following multiple complaints about the accuracy and sourcing of published news reports.",
    "Suspension issued after failure to comply with platform verification requirements submitted more than sixty days ago.",
    "Temporary hold placed due to unusual login activity suggesting potential unauthorized access to this account.",
    "Account suspended pending review of financial transactions associated with a fundraising campaign flagged by our trust team.",
    "Suspension issued following receipt of a formal legal notice regarding content posted in the past thirty days.",
    "Account temporarily restricted while our team reviews reported violations of the platform's election integrity guidelines.",
    "Unusual automated activity patterns detected on this account, triggering a precautionary security suspension review.",
    "Account placed on hold after the associated payment method was flagged for suspicious transactions by our processor.",
    "Temporary suspension while we investigate a reported breach of our journalist credentialing and verification standards.",
];

// ─── 50 User name records ────────────────────────────────────
const userNames = [
    ["Amélie Laurent", "amlie_laurent", "amelie.laurent"],
    ["James Whitfield", "james_wf", "james.whitfield"],
    ["Yuki Tanaka", "yuki_t", "yuki.tanaka"],
    ["Brianna Cole", "brianna_c", "brianna.cole"],
    ["Raj Patel", "raj_patel", "raj.patel"],
    ["Simone Nguyen", "simone_ng", "simone.nguyen"],
    ["Carlos Vargas", "carlos_v", "carlos.vargas"],
    ["Hannah Schultz", "hannah_s", "hannah.schultz"],
    ["Michael Osei", "mike_osei", "michael.osei"],
    ["Layla Hassan", "layla_h", "layla.hassan"],
    ["Finn McCarthy", "finn_mc", "finn.mccarthy"],
    ["Valentina Cruz", "valen_cruz", "valentina.cruz"],
    ["Desmond Kirk", "dez_kirk", "desmond.kirk"],
    ["Nora Lindqvist", "nora_lq", "nora.lindqvist"],
    ["Adrian Flores", "adrian_f", "adrian.flores"],
    ["Zara Khan", "zara_k", "zara.khan"],
    ["Tobias Roth", "tobias_r", "tobias.roth"],
    ["Chiara Esposito", "chiara_e", "chiara.esposito"],
    ["Marcus Bell", "marcus_b", "marcus.bell"],
    ["Aaliyah Stone", "aaliyah_s", "aaliyah.stone"],
    ["Patrick Dunn", "patrick_d", "patrick.dunn"],
    ["Mei Zhou", "mei_zhou", "mei.zhou"],
    ["Omar Farouk", "omar_f", "omar.farouk"],
    ["Isabel Ferreira", "isabel_f", "isabel.ferreira"],
    ["Lucas Grant", "lucas_g", "lucas.grant"],
    ["Tessa Harrington", "tessa_h", "tessa.harrington"],
    ["Kofi Mensah", "kofi_m", "kofi.mensah"],
    ["Vivian Park", "vivian_p", "vivian.park"],
    ["Alistair Webb", "alistair_w", "alistair.webb"],
    ["Daniela Moreno", "daniela_m", "daniela.moreno"],
    ["Sebastian Cole", "seb_cole", "sebastian.cole"],
    ["Anika Sharma", "anika_s", "anika.sharma"],
    ["Tyrone Jackson", "tyrone_j", "tyrone.jackson"],
    ["Freya Andersen", "freya_a", "freya.andersen"],
    ["Mateo Delgado", "mateo_d", "mateo.delgado"],
    ["Chloe Dupont", "chloe_dp", "chloe.dupont"],
    ["Idris Okonkwo", "idris_o", "idris.okonkwo"],
    ["Penelope Shaw", "penelope_s", "penelope.shaw"],
    ["Rajan Pillai", "rajan_p", "rajan.pillai"],
    ["Astrid Johansson", "astrid_j", "astrid.johansson"],
    ["Devon Wallace", "devon_w", "devon.wallace"],
    ["Camila Ortega", "camila_o", "camila.ortega"],
    ["Eliot Chambers", "eliot_c", "eliot.chambers"],
    ["Fatou Diallo", "fatou_d", "fatou.diallo"],
    ["Griffin Nash", "griffin_n", "griffin.nash"],
    ["Hana Suzuki", "hana_s", "hana.suzuki"],
    ["Ignacio Ruiz", "ignacio_r", "ignacio.ruiz"],
    ["Jade Thornton", "jade_t", "jade.thornton"],
    ["Kieran O'Brien", "kieran_ob", "kieran.obrien"],
    ["Lena Becker", "lena_b", "lena.becker"],
];

// ─── 50 Reporter name records ────────────────────────────────
const reporterNames = [
    ["Dana Holloway", "dana_holloway", "dana.holloway"],
    ["Victor Reyes", "victor_r", "victor.reyes"],
    ["Sophia Andreou", "sophia_a", "sophia.andreou"],
    ["Kwame Asante", "kwame_a", "kwame.asante"],
    ["Rachel Bloom", "rachel_b", "rachel.bloom"],
    ["Stefan Müller", "stefan_m", "stefan.mueller"],
    ["Priyanka Iyer", "priyanka_i", "priyanka.iyer"],
    ["Darius Ford", "darius_f", "darius.ford"],
    ["Elena Kowalski", "elena_kw", "elena.kowalski"],
    ["Taye Williams", "taye_w", "taye.williams"],
    ["Ingrid Svensson", "ingrid_sv", "ingrid.svensson"],
    ["Jaylen Brooks", "jaylen_b", "jaylen.brooks"],
    ["Amara Diallo", "amara_d", "amara.diallo"],
    ["Kristoff Nowak", "kristoff_n", "kristoff.nowak"],
    ["Serena Castillo", "serena_c", "serena.castillo"],
    ["Ryo Nakamura", "ryo_n", "ryo.nakamura"],
    ["Fatou Camara", "fatou_c", "fatou.camara"],
    ["Brendan Walsh", "brendan_w", "brendan.walsh"],
    ["Lena Hoffmann", "lena_hoff", "lena.hoffmann"],
    ["Cyrus Tehrani", "cyrus_t", "cyrus.tehrani"],
    ["Bianca Ferrero", "bianca_f", "bianca.ferrero"],
    ["Elijah Monroe", "elijah_m", "elijah.monroe"],
    ["Yara Saleh", "yara_s", "yara.saleh"],
    ["Nathan Oguike", "nathan_o", "nathan.oguike"],
    ["Claire Beaumont", "claire_b", "claire.beaumont"],
    ["Miles Thornton", "miles_t", "miles.thornton"],
    ["Asha Patel", "asha_p", "asha.patel"],
    ["Connor Fitzgerald", "connor_f", "connor.fitzgerald"],
    ["Lila Devereux", "lila_d", "lila.devereux"],
    ["Emeka Obi", "emeka_o", "emeka.obi"],
    ["Nadia Volkov", "nadia_v", "nadia.volkov"],
    ["Troy Harmon", "troy_h", "troy.harmon"],
    ["Isabel Szabo", "isabel_sz", "isabel.szabo"],
    ["Fabian Ortiz", "fabian_o", "fabian.ortiz"],
    ["Miriam Cohen", "miriam_c", "miriam.cohen"],
    ["Andre Duplessis", "andre_d", "andre.duplessis"],
    ["Priya Krishnamurthy", "priya_k", "priya.krishnamurthy"],
    ["Tobias Wenger", "tobias_wen", "tobias.wenger"],
    ["Simone Adesanya", "simone_ad", "simone.adesanya"],
    ["Declan Murray", "declan_m", "declan.murray"],
    ["Zainab Hussain", "zainab_h", "zainab.hussain"],
    ["Nico Papadopoulos", "nico_p", "nico.papadopoulos"],
    ["Alicia Drummond", "alicia_d", "alicia.drummond"],
    ["Bayo Adeleke", "bayo_a", "bayo.adeleke"],
    ["Charlotte Vance", "charlotte_v", "charlotte.vance"],
    ["Finn Gallagher", "finn_g", "finn.gallagher"],
    ["Sasha Petrova", "sasha_p", "sasha.petrova"],
    ["Malik Jefferson", "malik_j", "malik.jefferson"],
    ["Ingrid Larsson", "ingrid_l", "ingrid.larsson"],
    ["Rowan Callahan", "rowan_c", "rowan.callahan"],
];

// ─── 20 Bios ─────────────────────────────────────────────────
const bios = [
    "Passionate storyteller who believes every voice matters. Covering community stories that inspire change, uplift neighborhoods, and hold institutions accountable across America's most vibrant and underrepresented cities.",
    "Digital native exploring the intersection of culture, politics, and everyday life. Dedicated to making complex issues accessible and sparking meaningful conversations that lead to real-world impact.",
    "Local advocate and content creator. Sharing honest perspectives on housing, healthcare, and social justice to empower readers and amplify voices that are too often left out of mainstream narratives.",
    "Award-winning journalist with a decade of field experience. Committed to accuracy, fairness, and giving communities the in-depth reporting they deserve on issues that shape their daily lives.",
    "Curious mind with a camera. Documenting the human stories behind headlines, from neighborhood diners to city hall chambers, with empathy, rigor, and a deep love for this country.",
    "Investigative reporter specializing in environmental and public health issues. Holding corporations and governments accountable through data-driven journalism that drives policy change nationwide.",
    "Community organizer turned correspondent. Using the platform to bridge gaps between institutions and the people they serve, one thoroughly researched and compassionately told story at a time.",
    "Sports and culture journalist covering the moments that unite us—on and off the field. Believer in the transformative power of storytelling and the communities built around shared passions.",
    "Tech and business reporter following the money and the mission. Tracking startups, regulations, and economic trends that affect workers, consumers, and communities across the country.",
    "Health and science correspondent. Translating cutting-edge research into clear, actionable information for readers who deserve to understand the forces shaping their bodies and their world.",
    "Former public defender turned civic journalist. Covering criminal justice, incarceration, and the human cost of a legal system that too often fails the people it was built to protect.",
    "Visual storyteller and documentary photographer embedded in communities across America. Believing that the most important stories are found far from the spotlight of the national media.",
    "Education reporter focused on equity, access, and the future of learning. Dedicated to amplifying student and teacher voices that rarely make it into the halls of power and policy.",
    "Political correspondent with a background in grassroots organizing. Covering elections, legislation, and the gap between campaign promises and the reality experienced by everyday citizens.",
    "Food and culture writer celebrating the diversity of American kitchens and the communities built around shared meals. Every recipe is a story and every story is worth telling.",
    "Climate and environment journalist tracking the frontlines of the climate crisis in communities that bear the heaviest burden while contributing the least to the problem causing it.",
    "Freelance correspondent covering immigration, identity, and the American dream as experienced by first and second generation families navigating a complex and often unwelcoming system.",
    "Business journalist demystifying the economy for everyday readers. Translating Wall Street jargon into plain language that helps people understand how financial decisions affect their lives.",
    "Local government reporter covering city councils, school boards, and the quiet decisions that shape neighborhoods. Believing accountability begins at the most local level of governance.",
    "Multimedia journalist producing text, audio, and video content. Committed to reaching audiences wherever they are with stories that matter and information they can actually use.",
];

// ─── 50 Locations (all USA) ───────────────────────────────────
const locations = [
    "Miami, Florida, USA", "New York City, New York, USA", "Los Angeles, California, USA",
    "Chicago, Illinois, USA", "Houston, Texas, USA", "Phoenix, Arizona, USA",
    "Philadelphia, Pennsylvania, USA", "San Antonio, Texas, USA", "San Diego, California, USA",
    "Dallas, Texas, USA", "Austin, Texas, USA", "Jacksonville, Florida, USA",
    "Columbus, Ohio, USA", "Charlotte, North Carolina, USA", "San Francisco, California, USA",
    "Indianapolis, Indiana, USA", "Seattle, Washington, USA", "Denver, Colorado, USA",
    "Nashville, Tennessee, USA", "Boston, Massachusetts, USA", "Portland, Oregon, USA",
    "Las Vegas, Nevada, USA", "Memphis, Tennessee, USA", "Atlanta, Georgia, USA",
    "Baltimore, Maryland, USA", "Louisville, Kentucky, USA", "Milwaukee, Wisconsin, USA",
    "Albuquerque, New Mexico, USA", "Tucson, Arizona, USA", "Sacramento, California, USA",
    "Mesa, Arizona, USA", "Kansas City, Missouri, USA", "Omaha, Nebraska, USA",
    "Colorado Springs, Colorado, USA", "Raleigh, North Carolina, USA", "Long Beach, California, USA",
    "Virginia Beach, Virginia, USA", "Minneapolis, Minnesota, USA", "Tampa, Florida, USA",
    "New Orleans, Louisiana, USA", "Arlington, Texas, USA", "Wichita, Kansas, USA",
    "Bakersfield, California, USA", "Aurora, Colorado, USA", "Anaheim, California, USA",
    "Santa Ana, California, USA", "Corpus Christi, Texas, USA", "Riverside, California, USA",
    "St. Louis, Missouri, USA", "Lexington, Kentucky, USA",
];

// ─── 50 Phone numbers ────────────────────────────────────────
const phoneNumbers = [
    "(907) 555-0101", "(212) 555-0134", "(310) 555-0178", "(312) 555-0192", "(713) 555-0116",
    "(602) 555-0143", "(215) 555-0167", "(210) 555-0189", "(619) 555-0155", "(214) 555-0122",
    "(512) 555-0148", "(904) 555-0173", "(614) 555-0161", "(704) 555-0137", "(415) 555-0185",
    "(317) 555-0129", "(206) 555-0146", "(720) 555-0163", "(615) 555-0118", "(617) 555-0190",
    "(503) 555-0152", "(702) 555-0175", "(901) 555-0141", "(404) 555-0168", "(410) 555-0133",
    "(502) 555-0119", "(414) 555-0157", "(505) 555-0144", "(520) 555-0182", "(916) 555-0126",
    "(480) 555-0139", "(816) 555-0171", "(402) 555-0108", "(719) 555-0165", "(919) 555-0183",
    "(562) 555-0112", "(757) 555-0149", "(612) 555-0136", "(813) 555-0177", "(504) 555-0123",
    "(817) 555-0158", "(316) 555-0194", "(661) 555-0131", "(303) 555-0187", "(714) 555-0145",
    "(657) 555-0162", "(361) 555-0128", "(951) 555-0174", "(314) 555-0116", "(859) 555-0153",
];

// ─── 50 Portrait seeds ───────────────────────────────────────
const portraitSeeds = [
    "1535713875002-d1fcc65160e4", "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e",
    "1438761681033-6461ffad8d80", "1472099645785-5658abf4ff4e", "1489424731084-a5d8b06e4923",
    "1527980965255-d3b416303d12", "1544005313-94ddf0286df2", "1507003211169-0a1dd7228f2d",
    "1554151228-14d9def656e4", "1552058544-f2b08422138a", "1580489944761-15a19d654956",
    "1546961342-ea5f62d5a27a", "1521146764736-56c929d59c83", "1531746020798-e6953c6e8e04",
    "1573496359142-b8d87734a5a2", "1519085360753-af0119f7cbe7", "1508214751196-bcfd4ca60f91",
    "1557862921-37829c790f19", "1487412720507-e7ab37603c6f", "1506794778202-cad84cf45f1d",
    "1519345182560-3f2917c472d6", "1542909168-82c89c0a2bb7", "1528892952291-009c663ce843",
    "1560250097-0b93528c311a", "1531727096-f3b7b5c16842", "1458682625221-3a62f97ccf15",
    "1488161436001-b4d4bf6b5f08", "1469854523086-cc02fe5d8800", "1493707778029-39c84c66e31e",
    "1530541930197-ff16a3eaed18", "1527525443983-6e60c75fff46", "1544551763-46a013bb70d5",
    "1500462918776-62e7b24d01ec", "1473081556163-be14d275a2e8", "1477414348822-d1cbd4c95da2",
    "1535713875002-d1fcc65160e4", "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e",
    "1438761681033-6461ffad8d80", "1472099645785-5658abf4ff4e", "1489424731084-a5d8b06e4923",
    "1527980965255-d3b416303d12", "1544005313-94ddf0286df2", "1507003211169-0a1dd7228f2d",
    "1554151228-14d9def656e4", "1552058544-f2b08422138a", "1580489944761-15a19d654956",
    "1546961342-ea5f62d5a27a", "1521146764736-56c929d59c83",
];

// ─── 50 Cover seeds ───────────────────────────────────────────
const coverSeeds = [
    "1465146344240-a2dbf5c7b027", "1504711434969-e33886168f5c", "1488590528505-98d2b5aba04b",
    "1526948128573-703ee1aeb6fa", "1551836022-4196f83abcec", "1464822759023-fed622ff2c3b",
    "1503676260728-1c00da094a0b", "1477959858617-67f85cf4f1a2", "1562774053-0ef85b163c2d",
    "1495020689067-958852a7765e", "1499678567675-2bba5f5e4b1e", "1541963463532-d153efff33ef",
    "1486312338219-ce68d2c6f44d", "1543286386-713bdd548da4", "1518770660439-4636190af475",
    "1517694712202-14dd9538aa97", "1607082348824-0a96f2a4b9da", "1555212697-194d15aa18cf",
    "1511707171634-56260b214de0", "1508739773434-c26b3d09e071", "1558618666-fcd25c85cd64",
    "1515879218367-8466d910aaa4", "1509718443690-d8e2fb3474b7", "1564410267841-915d8e4d71ea",
    "1587574293340-e0011c4e8ecf", "1528360983277-13d401cdc186", "1495653797063-3c16de5a1d2e",
    "1473081556163-be14d275a2e8", "1477414348822-d1cbd4c95da2", "1530541930197-ff16a3eaed18",
    "1527525443983-6e60c75fff46", "1544551763-46a013bb70d5", "1500462918776-62e7b24d01ec",
    "1469854523086-cc02fe5d8800", "1493707778029-39c84c66e31e", "1458682625221-3a62f97ccf15",
    "1488161436001-b4d4bf6b5f08", "1465146344240-a2dbf5c7b027", "1504711434969-e33886168f5c",
    "1488590528505-98d2b5aba04b", "1526948128573-703ee1aeb6fa", "1551836022-4196f83abcec",
    "1464822759023-fed622ff2c3b", "1503676260728-1c00da094a0b", "1477959858617-67f85cf4f1a2",
    "1562774053-0ef85b163c2d", "1495020689067-958852a7765e", "1499678567675-2bba5f5e4b1e",
    "1541963463532-d153efff33ef", "1486312338219-ce68d2c6f44d",
];

const allStatuses = ["active", "inactive", "blocked", "suspended"];
const verificationStatuses = ["pending", "verified", "rejected"];

const links = [
    "www.socialsocietynews.com", "www.thedailybriefing.us", "www.frontlinereports.net",
    "www.urbandispatch.com", "www.thenewswire.org", "www.groundlevelstories.com",
    "www.civicvoicenews.com", "www.thecommonsreport.net", "www.horizonnewsroom.com",
    "www.streetlevelpress.com", "www.localvoicesusa.com", "www.communitypulse.net",
    "www.thefielddispatch.com", "www.groundtruthreports.org", "www.citizenchronicle.us",
    "www.openmikenews.com", "www.thelocalbeat.net", "www.directlinereports.com",
    "www.mainstreetmedia.us", "www.theneighborhoodpost.com",
];

// ─── Build a single account ───────────────────────────────────
const buildAccount = (idx, type) => {
    const names = type === "user" ? userNames : reporterNames;
    const offset = type === "reporter" ? 50 : 0;
    const [fullName, uname, emailPrefix] = names[idx];
    const absIdx = offset + idx;

    const statusValue = allStatuses[absIdx % allStatuses.length];
    const isReported = absIdx % 7 === 0;

    const statusObj = (() => {
        if (statusValue === "blocked") return { value: "blocked", reason: blockReasons[idx % blockReasons.length] };
        if (statusValue === "suspended") return { value: "suspended", reason: suspendReasons[idx % suspendReasons.length] };
        return { value: statusValue };
    })();

    const reported = isReported
        ? { isReported: true, reportCount: ((idx * 7) % 40) + 3 }
        : { isReported: false };

    const followers = getMini(Array.from({ length: 20 }, (_, i) => absIdx * 3 + i));
    const following = getMini(Array.from({ length: 20 }, (_, i) => absIdx * 5 + i + 10));

    const account = {
        id: `${type}_${String(idx + 1).padStart(3, "0")}`,
        type,
        name: fullName,
        username: `@${uname}`,
        email: `${emailPrefix}@gmail.com`,
        phoneNumber: phoneNumbers[idx],
        profilePicture: portrait(portraitSeeds[idx]),
        coverImage: cover(coverSeeds[idx]),
        bio: bios[idx % bios.length],
        link: `https://${links[idx % links.length]}`,
        location: locations[idx],
        followersCount: ((idx * 173 + 50) % 9900) + 100,
        followers,
        followingCount: ((idx * 137 + 30) % 5000) + 50,
        following,
        newsReportCount: ((idx * 23 + 10) % 490) + 10,
        activeCampaignCount: ((idx * 17 + 5) % 95) + 5,
        status: statusObj,
        ...reported,
        posts: makePosts(absIdx),
        campaigns: makeCampaigns(absIdx, 2),
    };

    if (type === "reporter") {
        account.verificationRequest = verificationStatuses[idx % verificationStatuses.length];
    }

    return account;
};

// ─── Generate 50 users + 50 reporters ────────────────────────
export const users = Array.from({ length: 50 }, (_, i) => buildAccount(i, "user"));
export const reporters = Array.from({ length: 50 }, (_, i) => buildAccount(i, "reporter"));
export const dummyData = [...users, ...reporters];

export default dummyData;