import { firebaseConfig } from "./firebase.js";

// Live in-memory caches populated directly from Firestore collections
window.liveStudents = [];
window.liveInstructors = [];

// Simulated Backend using localStorage

const DB_KEY = 'jilgm_students';
const SESSION_KEY = 'jilgm_current_user';
const UNLOCKED_KEY = 'jilgm_unlocked_modules';
const CONTENT_KEY = 'jilgm_modules_content';
const ARCHIVED_KEY = 'jilgm_archived_modules';
const ORDER_KEY = 'jilgm_module_order';
const SYNC_URL = 'https://kvdb.io/77qStFRtuvn7tEodfp9gET/';

function triggerStorageSync(key) {
    try {
        const event = new Event('storage');
        Object.defineProperty(event, 'key', { value: key, writable: true });
        window.dispatchEvent(event);
    } catch (e) {
        console.error("Error triggering storage sync event:", e);
    }
}

const jilgmChannel = (() => {
    try { return new BroadcastChannel('jilgm_sync'); } catch (e) { return null; }
})();

function jilgmBroadcast(type, payload) {
    if (jilgmChannel) {
        jilgmChannel.postMessage({ type, payload, ts: Date.now() });
    }
}

const defaultModules = {
    module1: {
        title: "The Call to Shepherd",
        subtitle: "Foundations of character, servanthood, and spiritual authority.",
        components: [
            { type: 'header_h1', content: 'Week 1: The Call to Shepherd' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, you will:<br>1. Understand the biblical meaning of shepherd leadership as modeled by Christ and mandated by Scripture.<br>2. Identify the critical difference between divine calling and human ambition in ministry.<br>3. Reflect personally on the authenticity and implications of your pastoral calling.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction' },
            { type: 'text', content: 'This opening lesson sets the theological and spiritual foundation for the entire masterclass. Shepherd leadership is not a management technique or career path—it is a sacred trust given by Christ Himself.' },
            { type: 'quote', content: '\"Spiritual leadership is not a matter of superior age, status, or education—it flows from a heart that loves God supremely and desires to serve His people.\"<br>— J. Oswald Sanders, <em>Spiritual Leadership</em>' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Before diving into the lesson, spend time in personal reflection on your own call. Your authenticity in this area will deeply impact how participants receive this material.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Jesus Restores Peter and Commissions Him' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>John 21:15-17 (ESV)</strong><br>When they had finished breakfast, Jesus said to Simon Peter, \"Simon, son of John, do you love me more than these?\" He said to him, \"Yes, Lord; you know that I love you.\" He said to him, \"Feed my lambs.\" He said to him a second time, \"Simon, son of John, do you love me?\" He said to him, \"Yes, Lord; you know that I love you.\" He said to him, \"Tend my sheep.\" He said to him the third time, \"Simon, son of John, do you love me?\" Peter was grieved because he said to him the third time, \"Do you love me?\" and he said to him, \"Lord, you know everything; you know that I love you.\" Jesus said to him, \"Feed my sheep.\"' },
            { type: 'header_h3', content: 'A. The Context of Restoration' },
            { type: 'text', content: 'Peter had denied Christ three times (John 18:15-27). This threefold commissioning directly parallels and heals that threefold failure. Jesus doesn\'t simply forgive Peter—He restores him to purpose.' },
            { type: 'quote', content: '\"He restores my soul. He leads me in paths of righteousness for his name\'s sake.\"<br>— Psalm 23:3 (ESV)' },
            { type: 'callout', emoji: '👤', bg: 'soft-gold', content: 'Timothy Witmer in <em>The Shepherd Leader</em> emphasizes that \"pastoral ministry always begins with the shepherd\'s own relationship with the Chief Shepherd\". Peter could not tend sheep until his own soul was restored. <strong>Reflection:</strong> Before you lead others, how is your relationship with Christ being examined and restored?' },
            { type: 'header_h3', content: 'B. Love as the Foundation of Shepherding' },
            { type: 'text', content: 'Three times Jesus asks, \"Do you love me?\" The progression reveals that shepherd leadership is fundamentally relational, not functional. The Greek text uses two different words for love (agapao and phileo), suggesting Jesus meets Peter where he is while calling him higher.' },
            { type: 'quote', content: '\"The prerequisite for shepherding is not talent, training, or temperament—it is love for Christ. Ministry flows from devotion.\"<br>— John MacArthur, <em>Pastoral Ministry</em>' },
            { type: 'callout', emoji: '📜', bg: 'soft-navy', content: '<strong>Key Supporting Verses:</strong><br>• <em>1 Corinthians 16:22:</em> \"If anyone has no love for the Lord, let him be accursed.\"<br>• <em>1 John 4:19:</em> \"We love because he first loved us.\"' },
            { type: 'header_h3', content: 'C. The Threefold Commission' },
            { type: 'text', content: '<p>The commands of Jesus reveal the comprehensive scope of shepherding care:</p><div style=\"overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--glass-border); border-radius: 8px;\"><table style=\"width: 100%; border-collapse: collapse; font-family: var(--font-sans); text-align: left;\"><thead><tr style=\"background: rgba(212, 175, 55, 0.1); border-bottom: 1.5px solid var(--accent-gold);\"><th style=\"padding: 12px; font-weight: 600; color: var(--accent-gold);\">Jesus\' Command</th><th style=\"padding: 12px; font-weight: 600; color: var(--accent-gold);\">Greek Term</th><th style=\"padding: 12px; font-weight: 600; color: var(--accent-gold);\">Meaning</th><th style=\"padding: 12px; font-weight: 600; color: var(--accent-gold);\">Application</th></tr></thead><tbody><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px; font-weight: 500;\">\"Feed my lambs\"</td><td style=\"padding: 12px; font-style: italic;\">Bosko</td><td style=\"padding: 12px;\">To nourish, provide food</td><td style=\"padding: 12px;\">Nurturing new believers, foundational teaching</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px; font-weight: 500;\">\"Tend my sheep\"</td><td style=\"padding: 12px; font-style: italic;\">Poimaino</td><td style=\"padding: 12px;\">To shepherd, guide, protect</td><td style=\"padding: 12px;\">Ongoing pastoral care, leadership, protection</td></tr><tr><td style=\"padding: 12px; font-weight: 500;\">\"Feed my sheep\"</td><td style=\"padding: 12px; font-style: italic;\">Bosko</td><td style=\"padding: 12px;\">To nourish, provide food</td><td style=\"padding: 12px;\">Sustained spiritual feeding for mature believers</td></tr></tbody></table></div>' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Notice the comprehensive nature of the call—it covers both young and mature believers, and involves both feeding (teaching) and tending (guiding, protecting). No aspect of the flock is excluded from pastoral concern.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Question:</strong> Why do you think Jesus asked Peter about love before commissioning him to shepherd? What does this suggest about the motivation required for ministry?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Shepherding as Spiritual Responsibility' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Acts 20:28 (ESV)</strong><br>\"Pay careful attention to yourselves and to all the flock, in which the Holy Spirit has made you overseers, to care for the church of God, which he obtained with his own blood.\"' },
            { type: 'header_h3', content: 'A. \"Pay Careful Attention to Yourselves\"' },
            { type: 'text', content: 'The first responsibility of the shepherd is self-watch. Paul\'s order is deliberate: yourself first, then the flock.' },
            { type: 'quote', content: '\"Keep a close watch on yourself and on the teaching. Persist in this, for by so doing you will save both yourself and your hearers.\"<br>— 1 Timothy 4:16 (ESV)' },
            { type: 'callout', emoji: '⚠️', bg: 'soft-red', content: 'Peter Scazzero in <em>Emotionally Healthy Spirituality</em> warns that \"the greatest gift you can give your congregation is your own transformation.\" He adds: \"It is not possible to lead people to a place you have never been yourself.\" Many pastoral failures begin with neglecting personal spiritual health.' },
            { type: 'toggle_list', title: '🔍 Self-Examination Checklist', content: '• When did you last examine your own spiritual condition before God?<br>• What systems do you have for accountability and self-care?<br>• Are you spiritually feeding yourself, or only preparing food for others?' },
            { type: 'header_h3', content: 'B. \"The Holy Spirit Has Made You Overseers\"' },
            { type: 'text', content: 'This phrase establishes several critical truths about spiritual leadership:' },
            { type: 'bullet_list', content: '- Divine appointment: The Holy Spirit places shepherds, not human committees alone.\n- Spiritual authority: Oversight is a Spirit-given trust, not earned status.\n- Accountability: Those whom the Spirit appoints, the Spirit will judge.' },
            { type: 'quote', content: '\"Obey your leaders and submit to them, for they are keeping watch over your souls, as those who will have to give an account.\"<br>— Hebrews 13:17 (ESV)' },
            { type: 'header_h3', content: 'C. \"The Church of God, Which He Obtained With His Own Blood\"' },
            { type: 'text', content: 'This is the theological weight that should humble every shepherd:<br>• The church is God\'s possession, not ours.<br>• It was purchased at infinite cost — the blood of Christ.<br>• Shepherds are stewards, not owners.' },
            { type: 'quote', content: '\"The shepherd must never forget that the sheep belong to Someone else. He answers to the Chief Shepherd for every soul under his care.\"<br>— John MacArthur' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Calling vs. Ambition' },
            { type: 'text', content: '<p>There is a critical boundary between a divine summoning and personal drive in ministry:</p><div style=\"overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--glass-border); border-radius: 8px;\"><table style=\"width: 100%; border-collapse: collapse; font-family: var(--font-sans); text-align: left;\"><thead><tr style=\"background: rgba(239, 68, 68, 0.05); border-bottom: 1.5px solid #ef4444;\"><th style=\"padding: 12px; font-weight: 600; color: #ef4444; width: 50%;\">True Calling</th><th style=\"padding: 12px; font-weight: 600; color: #ef4444; width: 50%;\">Mere Ambition</th></tr></thead><tbody><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px;\">Originates from God\'s initiative</td><td style=\"padding: 12px;\">Originates from personal desire for position</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px;\">Confirmed by the Spirit and community</td><td style=\"padding: 12px;\">Self-appointed or politically achieved</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px;\">Accompanied by burden for souls</td><td style=\"padding: 12px;\">Accompanied by desire for recognition</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px;\">Rooted in humility</td><td style=\"padding: 12px;\">Rooted in self-assertion</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px;\">Sustained through sacrifice</td><td style=\"padding: 12px;\">Results in entitled attitude</td></tr><tr><td style=\"padding: 12px;\">Sustained through sacrifice</td><td style=\"padding: 12px;\">Abandoned when costs rise</td></tr></tbody></table></div>' },
            { type: 'quote', content: '\"And no one takes this honor for himself, but only when called by God, just as Aaron was.\"<br>— Hebrews 5:4 (ESV)' },
            { type: 'callout', emoji: '⚠️', bg: 'soft-red', content: '<strong>Warning Against Ambition:</strong><br>• <em>Philippians 2:3:</em> \"Do nothing from selfish ambition or conceit, but in humility count others more significant than yourselves.\"<br>• <em>James 3:14-15:</em> \"But if you have bitter jealousy and selfish ambition in your hearts, do not boast and be false to the truth. This is not the wisdom that comes down from above, but is earthly, unspiritual, demonic.\"' },
            { type: 'header_h3', content: 'B. Marks of a Genuine Call' },
            { type: 'text', content: 'Timothy Witmer identifies several marks of authentic calling in <em>The Shepherd Leader</em> (pp. 51-58):' },
            { type: 'bullet_list', content: '- Inner compulsion: A sense that you must do this, not merely that you could.\n- Gifting: Demonstrable spiritual gifts for teaching, leading, caring.\n- Fruitfulness: Evidence of God using you in others\' lives.\n- External confirmation: The church recognizes and affirms the call.\n- Perseverance: The call remains through difficulty.' },
            { type: 'quote', content: '\"For necessity is laid upon me. Woe to me if I do not preach the gospel!\"<br>— 1 Corinthians 9:16 (ESV)' },
            { type: 'callout', emoji: '⚠️', bg: 'soft-red', content: 'Oswald Sanders cautions: \"It is possible to desire the office of a bishop and yet be seeking it for entirely wrong reasons—prestige, security, influence, or platform. The heart is deceitful above all things.\" (Jeremiah 17:9)' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: The Weight of Pastoral Leadership' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Hebrews 13:17 (ESV)</strong><br>\"Obey your leaders and submit to them, for they are keeping watch over your souls, as those who will have to give an account. Let them do this with joy and not with groaning, for that would be of no advantage to you.\"' },
            { type: 'header_h3', content: 'A. \"Keeping Watch Over Your Souls\"' },
            { type: 'text', content: 'The Greek word <em>gregoreo</em> means \"to be sleepless, watchful, vigilant.\" It carries the image of a night watchman who cannot rest while threats remain.' },
            { type: 'header_h3', content: 'B. \"As Those Who Will Have to Give an Account\"' },
            { type: 'text', content: 'Every shepherd will stand before God and answer for their stewardship. John MacArthur soberly writes: \"The shepherd will answer for doctrine taught, example set, prayers offered or neglected, warnings given or withheld. Every soul that passes through his care will be accounted for.\" (MacArthur, p. 145)' },
            { type: 'header_h3', content: 'C. The Emotional Weight' },
            { type: 'text', content: 'Peter Scazzero addresses this honestly: \"Ministry is the overflow of our interior life. When that well is dry or polluted, we have nothing life-giving to offer.\" The weight of shepherding involves:' },
            { type: 'bullet_list', content: '- Spiritual warfare: Shepherds are primary targets (Zechariah 13:7).\n- Emotional burden: Carrying others\' pain, failures, doubts.\n- Relational complexity: Leading people who may resist, criticize, or leave.\n- Personal sacrifice: Time, energy, family strain.' },
            { type: 'callout', emoji: '🛡️', bg: 'soft-green', content: '<strong>Sustaining Grace:</strong> Despite the weight, the call is not to a crushing burden but to sustainable obedience.<br>• <em>2 Corinthians 12:9:</em> \"My grace is sufficient for you, for my power is made perfect in weakness.\"<br>• <em>1 Peter 5:4:</em> \"And when the chief Shepherd appears, you will receive the unfading crown of glory.\"' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Reflection, Summary & Application' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: '<strong>Summary: Key Takeaways:</strong><br>1. <strong>Personal Restoration:</strong> We cannot give what we have not received from Christ.<br>2. <strong>Love for Christ is Essential:</strong> Without it, all ministry becomes performance.<br>3. <strong>Divine Appointment:</strong> The Holy Spirit makes overseers; we do not make ourselves.<br>4. <strong>The Sheep Belong to God:</strong> Purchased at the cost of Christ\'s blood, they are sacred trusts.<br>5. <strong>Sustainable Weight:</strong> Through dependence on Christ and honest self-care.' },
            { type: 'quote', content: '\"<strong>Closing Prayer:</strong><br>Lord Jesus, Chief Shepherd of our souls, we come before you humbled by the sacred trust of shepherd leadership. Restore what is broken in us. Deepen our love for you. Confirm our calling and correct our ambition. Give us the grace to bear the weight you have assigned, and the wisdom to care well for the souls you purchased with your own blood. May we one day hear, \'Well done, good and faithful servant.\' In your name we pray, Amen.\"' },
            { type: 'toggle_list', title: '📝 Homework & Memorization', content: '1. <strong>Read:</strong> 1 Peter 5:1-4 and Ezekiel 34:1-16<br>2. <strong>Journal:</strong> Write a 1-page reflection on your calling story—how did God call you, how has He confirmed it, and how has it been tested?<br>3. <strong>Memorize:</strong> Acts 20:28 (\"Pay careful attention to yourselves and to all the flock...\")' },
            { type: 'toggle_list', title: '📚 Reference & Citation Materials', content: '<strong>Books Cited:</strong><br>• Sanders, J. Oswald. <em>Spiritual Leadership: Principles of Excellence for Every Believer</em>. Chicago: Moody Publishers, 2007.<br>• Witmer, Timothy Z. <em>The Shepherd Leader: Achieving Effective Shepherding in Your Church</em>. Phillipsburg, NJ: P&R Publishing, 2010.<br>• MacArthur, John. <em>Pastoral Ministry: How to Shepherd Biblically</em>. Nashville: Thomas Nelson, 2005.<br>• Scazzero, Peter. <em>Emotionally Healthy Spirituality</em>. Grand Rapids: Zondervan, 2017.<br><br><strong>Additional Supporting Scriptures:</strong><br>• Psalm 78:70-72 (David as shepherd-king)<br>• Jeremiah 3:15 (God\'s promise of faithful shepherds)<br>• John 10:1-18 (Jesus as the Good Shepherd)<br>• 1 Peter 5:1-4 (Peter\'s charge to elders)<br>• Ezekiel 34 (God\'s indictment of unfaithful shepherds)' },
            { type: 'flip_card', icon: '🐑', front: 'What is Shepherd Leadership?', back: 'A sacred trust — given by Christ — to feed, tend, and protect souls purchased by His blood. It flows from love, not ambition.' },
            { type: 'true_false', statement: 'A pastor can effectively lead others even if their personal relationship with Christ is neglected.', correct: false, explanation: 'Jesus commissioned Peter only after restoring their relationship. Peter Scazzero warns: "The greatest gift you can give your congregation is your own transformation." Self-watch always comes before flock-watch (Acts 20:28).' },
            { type: 'multiple_choice', question: 'According to Acts 20:28, who makes someone an overseer of the church?', options: ['The church elder board', 'The bishop or denominational authority', 'The Holy Spirit', 'Personal gifting and ambition'], correct_index: 2, explanation: 'Acts 20:28 states clearly: "in which the Holy Spirit has made you overseers." Spiritual authority is divinely appointed, not humanly achieved.' },
            { type: 'question', content: 'Reflect on the five areas of personal reflection (Restoration, Love, Calling, Weight). Write a detailed journal response (minimum 20 characters) answering: How did you first sense God\'s call to shepherding leadership, and how is your relationship with Christ being examined and restored today?' }
        ]
    },
    module2: {
        title: "Qualifications of a Pastor",
        subtitle: "Biblical standards for pastoral character, family leadership, and spiritual maturity.",
        components: [
            { type: 'header_h1', content: 'Week 2: Qualifications of a Pastor' },
            { type: 'image', content: 'qualifications_pastor.png' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand the biblical qualifications required of a pastor or overseer.<br>2. Evaluate their personal character, family life, public reputation, and spiritual maturity in light of Scripture.<br>3. Recognize that pastoral ministry is rooted in tested integrity rather than charisma, talent, or ambition.<br>4. Discern areas of personal growth, repentance, and preparation for faithful ministry.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction & Preparation' },
            { type: 'text', content: 'This lesson builds on Week 1 - The Call to Shepherd. A genuine call to ministry must be matched by a qualified life. Scripture does not permit leaders to rely on gifting alone. The pastoral office is noble, but it carries moral, relational, and spiritual requirements that protect both the church and the leader.<br><br>Before teaching or studying, take time to carefully read 1 Timothy 3:1-7 and Titus 1:5-9. Pray through each qualification personally, allowing the Holy Spirit to examine your own life. Notice that Paul\'s concern is consistency of life, not image management.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Opening Segment (0-5 Minutes)' },
            { type: 'text', content: 'Begin with this opening question: <em>\"What qualifies a person to pastor a church: gifting, calling, influence, education, character, or experience?\"</em><br><br>While Scripture does not ignore gifting or calling, it places overwhelming emphasis on character. In Paul\'s pastoral epistles, the central issue is not whether a leader can attract attention, but whether their life makes them trustworthy to shepherd souls.' },
            { type: 'quote', content: '\"Lord, as we open your Word, search us deeply and honestly. Keep us from self-deception, pride, and comparison. Shape in us the kind of character that reflects Christ and protects your people. Amen.\"' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: The Blameless Life (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Timothy 3:2; Titus 1:6-7</strong><br>\"Therefore an overseer must be above reproach...\"<br>\"For an overseer, as God\'s steward, must be above reproach...\"' },
            { type: 'header_h3', content: 'A. Teaching Aim & Above Reproach' },
            { type: 'text', content: 'The qualification of being <strong>\"above reproach\"</strong> is the umbrella standard covering all other traits. It is the broad summary of a life that is credible, consistent, and morally trustworthy. It does not mean sinless perfection (a pastor is not flawless), but rather that they must not live in a pattern of conduct that gives legitimate grounds for accusation. Their life must show integrity, repentance, and consistency.' },
            { type: 'header_h3', content: 'B. The Pastor as God\'s Steward' },
            { type: 'text', content: 'Titus 1:7 describes the overseer as God\'s steward. A steward manages what belongs to another. The pastor is accountable to God for his life, doctrine, decisions, and example. The church is not the pastor\'s possession; their role is to faithfully oversee what belongs to Christ.' },
            { type: 'quote', content: '\"This is how one should regard us, as servants of Christ and stewards of the mysteries of God. Moreover, it is required of stewards that they be found faithful.\"<br>— 1 Corinthians 4:1-2' },
            { type: 'header_h3', content: 'C. Character Contrast Table' },
            { type: 'text', content: 'Paul includes both virtues to cultivate and vices to reject. Below is the character contrast table for pastoral qualifications:<br><br><div style=\"overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--glass-border); border-radius: 8px;\"><table style=\"width: 100%; border-collapse: collapse; font-family: var(--font-sans); text-align: left;\"><thead><tr style=\"background: rgba(212, 175, 55, 0.1); border-bottom: 1.5px solid var(--accent-gold);\"><th style=\"padding: 12px; font-weight: 600; color: var(--accent-gold);\">Disqualifying Traits</th><th style=\"padding: 12px; font-weight: 600; color: var(--accent-gold);\">Qualifying Traits</th></tr></thead><tbody><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px; font-weight: 500;\">Arrogant</td><td style=\"padding: 12px;\">Humble</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px; font-weight: 500;\">Quick-tempered</td><td style=\"padding: 12px;\">Self-controlled</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px; font-weight: 500;\">Greedy for gain</td><td style=\"padding: 12px;\">Generous and content</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px; font-weight: 500;\">Violent or harsh</td><td style=\"padding: 12px;\">Gentle</td></tr><tr style=\"border-bottom: 1px solid var(--glass-border);\"><td style=\"padding: 12px; font-weight: 500;\">Undisciplined</td><td style=\"padding: 12px;\">Upright and holy</td></tr><tr><td style=\"padding: 12px; font-weight: 500;\">Addicted or enslaved</td><td style=\"padding: 12px;\">Sober-minded</td></tr></tbody></table></div>' },
            { type: 'callout', emoji: '⚠️', bg: 'soft-red', content: '<strong>Emotional & Character Diagnostics:</strong><br>A leader may look competent externally while being internally ruled by anger, insecurity, or unresolved wounds. Peter Scazzero warns that emotional immaturity often appears in ministry as defensiveness, control, irritability, or an inability to receive correction.' },
            { type: 'header_h3', content: 'D. Ability to Teach Rests on Credibility of Life' },
            { type: 'text', content: 'Teaching is explicitly required, but teaching without character is spiritually dangerous. Truth spoken from an ungoverned life loses moral weight.' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Supporting Verse: 1 Timothy 4:16 (ESV)</strong><br>\"Keep a close watch on yourself and on the teaching. Persist in this, for by so doing you will save both yourself and your hearers.\"' },
            { type: 'quote', content: '<strong>Teacher Illustration:</strong> \"A sermon may impress people for an hour, but a life either confirms or contradicts that sermon every day.\"' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do you think Scripture gives so much more space to character than to skill when describing a pastor?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Family Leadership (18-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Timothy 3:4-5; Titus 1:6</strong><br>\"He must manage his own household well...\"<br>\"...his children are believers and not open to the charge of debauchery or insubordination.\"' },
            { type: 'header_h3', content: 'A. Proving Ground of Leadership' },
            { type: 'text', content: 'The home is the first proving ground of pastoral leadership. Faithfulness in the household is a key indicator of readiness to care for the church. Public ministry can be polished, but home life is harder to fake. If a man cannot lead, serve, guide, and govern his own household with dignity, he is not ready to shepherd God\'s church.' },
            { type: 'quote', content: '\"If someone does not know how to manage his own household, how will he care for God\'s church?\"<br>— 1 Timothy 3:5' },
            { type: 'header_h3', content: 'B. Moral Faithfulness & Marital Purity' },
            { type: 'text', content: 'The phrase \"husband of one wife\" describes a one-woman man—a leader marked by marital fidelity, purity, and covenant faithfulness. In a culture of secrecy, temptation, and fractured families, pastoral leaders must be faithful in thought, conduct, and affection.' },
            { type: 'header_h3', content: 'C. Children and Household Order' },
            { type: 'text', content: 'This standard does not require perfect children, but rather highlights that a pastor\'s home should show the fruit of intentional, dignified, and faithful leadership. Persistent chaos, neglect, or rebellion in the home may reveal deeper leadership issues.' },
            { type: 'quote', content: '\"Fathers, do not provoke your children to anger, but bring them up in the discipline and instruction of the Lord.\"<br>— Ephesians 6:4' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>The Shepherd\'s First Flock:</strong> Timothy Witmer emphasizes that the pastor must know, feed, lead, and protect those under his own roof first. Family neglect for the sake of ministry is not faithfulness; it is disorder. The home is the pastor\'s first small church.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Reputation Outside the Church (30-40 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Timothy 3:7</strong><br>\"Moreover, he must be well thought of by outsiders, so that he may not fall into disgrace, into a snare of the devil.\"' },
            { type: 'header_h3', content: 'A. Public Credibility' },
            { type: 'text', content: 'A pastor may be admired inside the church while being distrusted outside it. This is unacceptable. A man known as dishonest, harsh, unethical, irresponsible, or manipulative in the wider community lacks the moral credibility needed for shepherding. While the gospel itself offends, the leader\'s character must be honorable.' },
            { type: 'quote', content: '\"A good name is to be chosen rather than great riches, and favor is better than silver or gold.\"<br>— Proverbs 22:1' },
            { type: 'header_h3', content: 'B. Satan\'s Snare' },
            { type: 'text', content: 'A compromised reputation traps the leader and damages the church\'s witness. Satan delights in discrediting church leaders because fallen leaders confuse sheep, embolden cynics, and wound the church\'s testimony.' },
            { type: 'quote', content: '\"Walk in wisdom toward outsiders, making the best use of the time. Let your speech always be gracious, seasoned with salt, so that you may know how you ought to answer each person.\"<br>— Colossians 4:5-6' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Spiritual Maturity (40-50 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Timothy 3:6; Titus 1:9</strong><br>\"He must not be a recent convert, or he may become puffed up with conceit...\"<br>\"...holy, and disciplined. He must hold firm to the trustworthy word as taught...\"' },
            { type: 'header_h3', content: 'A. Vulnerability of New Converts' },
            { type: 'text', content: 'Paul warns that recent converts must not be placed too quickly into leadership. The danger is conceit—becoming inflated by position before character has been strengthened. Leadership exposes weaknesses; time, testing, suffering, and correction reveal root depth.' },
            { type: 'quote', content: '\"Pride goes before destruction, and a haughty spirit before a fall.\"<br>— Proverbs 16:18' },
            { type: 'header_h3', content: 'B. Doctrinal Steadiness & Discipline' },
            { type: 'text', content: 'Spiritual maturity includes ordered appetites, stable convictions, and a formed inner life. The pastor must hold firmly to sound doctrine to instruct others and protect the flock from false teachings. Emotional and relational depth are key: a leader can know theology and still be spiritually stunted by pride, denial, or insecurity.' },
            { type: 'quote', content: '\"He must hold firm to the trustworthy word as taught, so that he may be able to give instruction in sound doctrine and also to rebuke those who contradict it.\"<br>— Titus 1:9' },
            { type: 'callout', emoji: '🛡️', bg: 'soft-green', content: '<strong>Platform vs. Character:</strong> A platform can raise a person faster than their character can sustain them. The church must look for evidence of tested faithfulness, endurance, teachability, and holiness rather than quick visibility.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Assessment & Diagnostics' },
            { type: 'text', content: 'Move from studying the qualifications to examining yourself honestly before God. Reflect on these five areas of diagnostic evaluation:<br><br>1. <strong>Blameless Life:</strong> Is there any pattern in your character that makes you vulnerable to legitimate reproach?<br>2. <strong>Family Leadership:</strong> Does your home reflect dignity, love, order, faithfulness, and spiritual care?<br>3. <strong>Public Reputation:</strong> Would outsiders describe you as trustworthy, gracious, and honorable?<br>4. <strong>Spiritual Maturity:</strong> Are you growing in humility, discipline, doctrinal steadiness, and self-control?<br>5. <strong>Readiness for Ministry:</strong> Are you pursuing pastoral ministry because you are qualified and called, or mainly because you desire influence, identity, or platform?<br><br><em>Remind yourself that this exercise is not for comparison, but for consecration. The goal is honest surrender, not image protection.</em>' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary & Key Takeaways' },
            { type: 'bullet_list', content: '- Pastoral ministry is a noble task, but character must precede office.\n- The core qualification is a blameless, credible, and consistent life.\n- The home is the first and primary proving ground of shepherding leadership.\n- Public reputation outside the church directly affects the credibility of the gospel.\n- Spiritual maturity must be tested and proven over time before leadership is entrusted.\n- Character gives weight and authority to your calling and preaching.' },
            { type: 'quote', content: '\"<strong>Closing Prayer:</strong><br>Father, thank you for the seriousness and beauty of pastoral ministry. Search our hearts and expose what is hidden. Form in us lives that are above reproach, homes that reflect your order and love, reputations that honor Christ, and maturity that can carry the weight of leadership. Guard us from pride, self-deception, and ambition without holiness. Make us faithful shepherds for the sake of your church. In Jesus\' name, Amen.\"' },
            { type: 'toggle_list', title: '📝 Homework & Memory Verse', content: '1. <strong>Read:</strong> 1 Peter 5:1-4 and 1 Timothy 4:12-16.<br>2. <strong>Reflection Action:</strong> Journal which qualification is currently strongest in your life, and which needs the most intentional growth.<br>3. <strong>Personal Step:</strong> Invite one mature believer or mentor to speak honestly into your readiness for ministry.<br>4. <strong>Memory Verse:</strong> Memorize 1 Timothy 3:2 or Titus 1:7-9.' },
            { type: 'toggle_list', title: '📚 Reference & Citation Materials', content: '<strong>Recommended Resources:</strong><br>• Sanders, J. Oswald. <em>Spiritual Leadership: Principles of Excellence for Every Believer</em>.<br>• Witmer, Timothy Z. <em>The Shepherd Leader: Achieving Effective Shepherding in Your Church</em>.<br>• MacArthur, John. <em>Pastoral Ministry: How to Shepherd Biblically</em>.<br>• Scazzero, Peter. <em>Emotionally Healthy Spirituality</em>.' },
            { type: 'matching', pairs: [{ left: 'Above reproach', right: 'No valid accusation against his character' }, { left: 'Husband of one wife', right: 'Devoted and faithful in marriage' }, { left: 'Hospitable', right: 'Opens home generously to others' }, { left: 'Able to teach', right: 'Skilled in communicating Scripture' }] },
            { type: 'true_false', statement: 'The biblical qualifications for a pastor are primarily about spiritual giftedness and preaching ability.', correct: false, explanation: 'Paul\'s lists in 1 Timothy 3 and Titus 1 focus overwhelmingly on character — being "above reproach," "self-controlled," "respectable." Ability to teach is listed, but character qualifications outnumber skills by roughly 10:1.' },
            { type: 'question', content: 'Reflect on the qualifications discussed. Write a detailed journal response (minimum 20 characters) answering: The qualification I most need God to deepen in me right now is...' },
            { type: 'file_upload', title: 'Module 2 Assignment: Personal Reflection & Action Plan', content: 'Upload your written reflection journal or video testimony showing how your character and home leadership are aligned with biblical standards. We accept images, videos, and documents.' }
        ]
    },
    module3: {
        title: "Theology of the Church",
        subtitle: "Understanding the church as Christ's body and the role of pastors in equipping the saints.",
        components: [
            { type: 'header_h1', content: 'Week 3: Theology of the Church' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand the church as Christ’s body under His authority and headship<br>2. Explain the biblical role of pastors as equippers of the saints<br>3. Recognize that spiritual unity and maturity are central goals of church ministry<br>4. Evaluate whether their ministry model is building dependence on the pastor or maturity in the body' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Session Overview for the Teacher' },
            { type: 'text', content: 'This lesson is not merely about church structure. It is about the <strong>nature, identity, and purpose</strong> of the church. Many ministry leaders unconsciously function as though the church were a business, a platform, or a weekly event. Ephesians 4 corrects that view. The church is the body of Christ, governed by Christ, nourished by Christ, and built up through every member’s participation.' },
            { type: 'text', content: 'This session is especially important for pastors and ministry leaders because poor ecclesiology produces poor ministry practice. When leaders misunderstand the church, they often create unhealthy dependency, consumer Christianity, over-centralized leadership, or shallow discipleship. By contrast, when pastors understand the theology of the church, they begin to labor not merely to gather crowds, but to build a spiritually healthy body.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Opening Segment (0-5 Minutes)' },
            { type: 'text', content: 'Begin by asking the participants this opening question:<br><br><strong>"When you think of the church, what image comes to mind first: organization, family, institution, event, or body?"</strong><br><br>Allow two or three brief responses. Then explain that how we answer this question shapes how we lead. If we think of the church mainly as an organization, we will prioritize efficiency. If we think of it mainly as an event, we will prioritize production. But if we understand it as the <strong>body of Christ</strong>, we will prioritize spiritual formation, mutual care, and maturity.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Christ as Head of the Church (5-15 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Ephesians 4:15-16</strong><br>"Rather, speaking the truth in love, we are to grow up in every way into him who is the head, into Christ, from whom the whole body, joined and held together by every joint with which it is equipped, when each part is working properly, makes the body grow so that it builds itself up in love."' },
            { type: 'header_h3', content: 'A. Christ is the source of the church\'s life' },
            { type: 'text', content: 'The body derives its life from the head. In the same way, the church receives direction, nourishment, authority, and identity from Christ. A church can have programs, budgets, and staff and still be spiritually weak if it is not truly drawing life from Christ.' },
            { type: 'quote', content: '"And he is the head of the body, the church." — Colossians 1:18' },
            { type: 'header_h3', content: 'B. Christ is the authority over the church' },
            { type: 'text', content: 'Since Christ is Head, the pastor has delegated authority, not autonomous authority. This guards against authoritarian leadership and personality cults. It also protects pastors from assuming they carry burdens Christ never assigned them.' },
            { type: 'quote', content: '"Shepherd the flock of God that is among you... not domineering over those in your charge, but being examples to the flock." — 1 Peter 5:2-3' },
            { type: 'header_h3', content: 'C. The church grows into Christ' },
            { type: 'text', content: 'Paul says the body is to "grow up in every way into him." The standard of church growth is not merely numerical increase, but conformity to Christ. Growth that does not produce Christlikeness is incomplete growth.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why is it dangerous for pastors to function as if they are the head of the church rather than servants under Christ’s authority?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Role of Pastors in Equipping the Saints (15-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Ephesians 4:11-12</strong><br>"And he gave the apostles, the prophets, the evangelists, the shepherds and teachers, to equip the saints for the work of ministry, for building up the body of Christ."' },
            { type: 'header_h3', content: 'A. Ministry leaders are gifts from Christ to the church' },
            { type: 'text', content: 'Paul says Christ "gave" these leaders. The church does not invent ministry offices for convenience. Christ Himself provides shepherds and teachers for the church’s good.' },
            { type: 'header_h3', content: 'B. The pastor equips rather than replaces the saints' },
            { type: 'text', content: 'The phrase "to equip the saints for the work of ministry" is central. The pastor is not meant to monopolize ministry. He trains, forms, instructs, corrects, and mobilizes believers so they can serve effectively.' },
            { type: 'header_h3', content: 'C. The work of ministry belongs to the whole church' },
            { type: 'text', content: 'Every believer has a role in the life of the body. Pastors are essential, but they are not the whole body. The church is weakened when members become passive consumers.' },
            { type: 'header_h3', content: 'D. Equipping includes doctrine, example, correction, and opportunity' },
            { type: 'bullet_list', content: '- <strong>Doctrinal formation</strong> - helping believers understand truth\n- <strong>Practical training</strong> - showing them how to serve\n- <strong>Spiritual formation</strong> - shaping character and maturity\n- <strong>Delegation and trust</strong> - giving real responsibility\n- <strong>Correction and encouragement</strong> - helping them grow through mistakes' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Spiritual Unity and Maturity (30-45 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Ephesians 4:13-14</strong><br>"...until we all attain to the unity of the faith and of the knowledge of the Son of God, to mature manhood, to the measure of the stature of the fullness of Christ, so that we may no longer be children, tossed to and fro by the waves and carried about by every wind of doctrine..."' },
            { type: 'header_h3', content: 'A. The goal is unity of the faith' },
            { type: 'text', content: 'Biblical unity is not superficial harmony or avoidance of conflict. It is shared grounding in the truth of Christ. Unity grows where truth is embraced together.' },
            { type: 'header_h3', content: 'B. The goal is mature manhood' },
            { type: 'text', content: 'Paul speaks of maturity in corporate terms. The church is to grow up together into the fullness of Christ. This maturity includes doctrine, character, discernment, relational health, and perseverance.' },
            { type: 'header_h3', content: 'C. The goal is doctrinal stability' },
            { type: 'text', content: 'Paul contrasts maturity with childhood. Spiritually immature believers are unstable, easily influenced, and vulnerable to deception. A healthy church is not easily manipulated by trends, personalities, or false doctrine.' },
            { type: 'header_h3', content: 'D. Truth and love must remain together' },
            { type: 'text', content: 'Verse 15 says, "speaking the truth in love." Truth without love becomes harsh. Love without truth becomes sentimental and weak. The church matures where both are held together.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Teacher Discussion Question:</strong> What usually threatens unity and maturity more in a church context: false doctrine, pride, unresolved conflict, consumerism, or pastoral overcontrol? Why?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: The Body Building Itself Up in Love (45-53 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Ephesians 4:16</strong><br>"...when each part is working properly, makes the body grow so that it builds itself up in love."' },
            { type: 'header_h3', content: 'A. Every member matters' },
            { type: 'text', content: 'Paul’s language leaves no room for spectatorship. The church is not designed for a few active leaders and many passive attenders. Every member contributes to health.' },
            { type: 'header_h3', content: 'B. Proper function requires order and interdependence' },
            { type: 'text', content: 'Not every member has the same role, but every member has value. Growth occurs through connectedness, not isolation.' },
            { type: 'header_h3', content: 'C. Love is not an accessory; it is the atmosphere of growth' },
            { type: 'text', content: 'The body builds itself up in love. This means church growth is not merely structural or doctrinal. It must be relationally textured by patience, service, humility, and care.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Reflection and Personal Application (53-58 Minutes)' },
            { type: 'bullet_list', content: '1. <strong>Headship Check:</strong> In practice, does my leadership show that Christ is truly the Head of the church?\n2. <strong>Equipping Check:</strong> Am I equipping people for ministry, or doing ministry in place of them?\n3. <strong>Maturity Check:</strong> Are the people I lead becoming more stable, more loving, and more grounded in truth?\n4. <strong>Unity Check:</strong> Am I contributing to peace and maturity, or unintentionally reinforcing dependency and immaturity?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Christ is the Head of the church — therefore pastoral authority is always delegated and accountable.\n- Pastors are given to equip the saints — ministry is not meant to be concentrated in one leader.\n- The goal of equipping is unity and maturity — not mere activity or attendance.\n- Doctrinal stability matters — immature churches are vulnerable churches.\n- Healthy churches build themselves up in love — every member matters in Christ’s design.' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> 1 Corinthians 12:12-27 and Colossians 1:15-20<br>2. <strong>Journal:</strong> In what ways has my ministry encouraged dependency on leaders rather than maturity in believers?<br>3. <strong>Ministry Audit:</strong> Identify one area where I can begin equipping others instead of carrying the entire burden myself.' },
            { type: 'question', content: 'Reflect on Ephesians 4 and your own ministry model. Write a brief response (minimum 20 characters): What is one specific way you need to change your leadership to better equip the saints for ministry?' },
            { type: 'file_upload', title: 'Module 3 Assignment', content: 'Upload your completed Ministry Audit or Journal Reflection for this week.' }
        ]
    },
    module4: {
        title: "Spiritual Disciplines of a Pastor",
        subtitle: "Prayer, the Word, spiritual sensitivity, and renewal rhythms for pastoral longevity.",
        components: [
            { type: 'header_h1', content: 'Week 4: Spiritual Disciplines of a Pastor' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand why spiritual disciplines are essential to pastoral longevity, clarity, and fruitfulness.<br>2. Recognize prayer as a central responsibility, not a secondary devotional habit.<br>3. Explain the pastor\'s calling as a word-centered ministry rooted in Scripture.<br>4. Discern the importance of spiritual sensitivity to the Holy Spirit\'s leading and conviction.<br>5. Evaluate their present spiritual rhythms and identify areas requiring removal or reordering.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction' },
            { type: 'text', content: 'This lesson moves from the character and ecclesiology of ministry into the inner life that sustains ministry. A pastor cannot lead others spiritually while neglecting the very practices that keep his own soul alive before God. Many ministry failures do not begin in public scandal; they begin in private dryness. The session is often called the "soul rhythms" of a pastor. Scripture becomes material for sermons instead of nourishment for the soul, and spiritual sensitivity is replaced by habit, pressure, or performance.' },
            { type: 'quote', content: '"But we will devote ourselves to prayer and to the ministry of the word."<br>— Acts 6:4' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: 'Acts 6:4 provides a foundational pastoral model. Prayer and the Word were themselves central ministry priorities. The order matters: the apostles did not view prayer as a warm-up to ministry. Prayer and the Word were themselves central ministry priorities.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Prayer Leadership (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Acts 6:4</strong><br>"But we will devote ourselves to prayer and to the ministry of the word."' },
            { type: 'header_h3', content: 'A. Prayer is an Expression of Pastoral Dependence' },
            { type: 'text', content: 'The apostles faced a legitimate ministry need in Acts 6, yet they refused to allow urgent demands to displace central duties. Their response teaches that the pastor must not lead from self-sufficiency. Prayer is how shepherds confess that the church belongs to God, people need God\'s power, and ministry fruit cannot be manufactured by human effort.' },
            { type: 'quote', content: '"Apart from me you can do nothing." — John 15:5<br>"Unless the Lord builds the house, those who build it labor in vain." — Psalm 127:1' },
            { type: 'header_h3', content: 'B. Prayer Leadership Means More Than Private Devotion' },
            { type: 'text', content: 'A praying pastor does not only have a personal prayer life; he leads the church through prayerful example, public prayer, intercession, and a ministry atmosphere shaped by dependence on God. This includes:' },
            { type: 'bullet_list', content: '- Praying for the flock by name\n- Bringing ministry decisions before God\n- Leading gathered prayer with sincerity and depth\n- Modeling a life that seeks God before acting\n- Interceding during conflict, grief, and uncertainty' },
            { type: 'quote', content: '"Far be it from me that I should sin against the Lord by ceasing to pray for you." — 1 Samuel 12:23<br>"Epaphras... always struggling on your behalf in his prayers." — Colossians 4:12' },
            { type: 'header_h3', content: 'C. Jesus Modeled a Life of Prayerful Leadership' },
            { type: 'text', content: 'Pastoral prayer is not merely apostolic practice; it is Christlike practice. Jesus regularly withdrew to pray, even amid intense ministry demands.' },
            { type: 'quote', content: '"And rising very early in the morning, while it was still dark, he departed and went out to a desolate place, and there he prayed." — Mark 1:35<br>"But he would withdraw to desolate places and pray." — Luke 5:16' },
            { type: 'header_h3', content: 'D. Prayer Protects the Pastor\'s Heart' },
            { type: 'text', content: 'Prayerlessness in ministry is often a form of practical self-reliance. A pastor who stops praying often becomes reactive, burdened, irritable, mechanical, or self-important. Peter Scazzero\'s insights fit well here: one of the clearest signs of emotional and spiritual dullness is functioning at a high level externally while disconnected internally from God. Prayer interrupts that illusion.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> Use this statement: "When a pastor stops praying deeply, he may still speak about God accurately while gradually losing living fellowship with God personally."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What usually pushes prayer to the margins of pastoral life, and why is that spiritually dangerous?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Word-Centered Ministry (18-33 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Acts 6:4; 2 Timothy 3:16-17</strong><br>"But we will devote ourselves to prayer and to the ministry of the word."<br>"All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness..."' },
            { type: 'header_h3', content: 'A. The Word is Central Because God Speaks Through It' },
            { type: 'text', content: 'The ministry of the Word is not merely the transfer of religious information. Scripture is God\'s breathed-out Word, carrying divine authority and life-giving power. A pastor\'s authority does not come from personality, eloquence, or office alone, but from faithful submission to and proclamation of Scripture.' },
            { type: 'quote', content: '"For the word of God is living and active..." — Hebrews 4:12<br>"Sanctify them in the truth; your word is truth." — John 17:17' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'John MacArthur strongly emphasizes that pastoral ministry must be word-governed. The leader does not invent messages; he delivers and applies God\'s message. When the Word is regularly integrated into worship, the church becomes the community it is designed to be. Scripture actively forms the culture, convictions, practices, and relationships of the body.' },
            { type: 'header_h3', content: 'B. The Pastor Must Be Fed by the Word Before Feeding Others' },
            { type: 'text', content: 'A major pastoral danger is treating the Bible only as sermon material. The shepherd must not merely study Scripture professionally; he must receive it personally. He cannot nourish others with what he has not himself been digesting.' },
            { type: 'quote', content: '"His delight is in the law of the Lord, and on his law he meditates day and night." — Psalm 1:2<br>"Until I come, devote yourself to the public reading of Scripture, to exhortation, to teaching." — 1 Timothy 4:13' },
            { type: 'header_h3', content: 'C. Word-Centered Ministry Shapes the Whole Church' },
            { type: 'text', content: 'Scripture governs a ministry, it shapes:<br>• Preaching and teaching<br>• Counseling and correction<br>• Decision-making and vision<br>• Discipleship and spiritual formation<br>• Worship and congregational life' },
            { type: 'quote', content: '"Let the word of Christ dwell in you richly..." — Colossians 3:16<br>"Preach the word; be ready in season and out of season..." — 2 Timothy 4:2' },
            { type: 'header_h3', content: 'D. The Word Trains and Guards the Pastor' },
            { type: 'text', content: 'Scripture not only equips the church; it corrects the leader. It rebukes, trains, exposes, and steadies him. A pastor who no longer allows the Bible to confront him personally is in spiritual danger.' },
            { type: 'quote', content: '"Keep a close watch on yourself and on the teaching." — 1 Timothy 4:16<br>"Your word is a lamp to my feet and a light to my path." — Psalm 119:105' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "If the Bible becomes only a tool in the pastor\'s hand and not a sword in the Spirit\'s hand against the pastor\'s own heart, his ministry will eventually become hollow."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What is the difference between using Scripture for ministry and being personally formed by Scripture?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Spiritual Sensitivity (33-46 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Romans 8:14; Galatians 5:25</strong><br>"For all who are led by the Spirit of God are sons of God."<br>"If we live by the Spirit, let us also keep in step with the Spirit."' },
            { type: 'header_h3', content: 'A. Spiritual Sensitivity Begins With Surrendered Living' },
            { type: 'text', content: 'Sensitivity to the Spirit is not mystical impressionism. It grows where a pastor lives in submission to Scripture, prayer, humility, repentance, and obedience. The Spirit who leads is the same Spirit who inspired the Word, so true spiritual sensitivity never moves against biblical truth.' },
            { type: 'quote', content: '"Show me your ways, O Lord; teach me your paths." — Psalm 25:4<br>"Today, if you hear his voice, do not harden your heart." — Hebrews 3:15' },
            { type: 'header_h3', content: 'B. The Insensitive Pastor Becomes Mechanical' },
            { type: 'text', content: 'When spiritual sensitivity declines, ministry may continue outwardly, but it becomes routine-driven, flesh-powered, and less responsive to conviction. The pastor may become less teachable, less discerning, less tender toward sin, and less responsive to the needs beneath the surface.' },
            { type: 'quote', content: '"Do not quench the Spirit." — 1 Thessalonians 5:19<br>"And do not grieve the Holy Spirit of God..." — Ephesians 4:30' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Peter Scazzero\'s emphasis is especially valuable here. Leaders often lose spiritual sensitivity long before their loss has public effectiveness. They continue performing ministry tasks while becoming inwardly numb, emotionally reactive, or spiritually disconnected.' },
            { type: 'header_h3', content: 'C. Spiritual Sensitivity is Vital for Shepherding People Well' },
            { type: 'text', content: 'Pastoral ministry involves more than delivering content. Shepherds must discern when people need correction, comfort, patience, confrontation, silence, or prayer. This requires spiritual attentiveness, not just administrative skill.' },
            { type: 'quote', content: '"I will instruct you and teach you in the way you should go..." — Psalm 32:8<br>"Who is sufficient for these things?" — 2 Corinthians 2:16' },
            { type: 'header_h3', content: 'D. Spiritual Sensitivity Requires Ongoing Self-Watch' },
            { type: 'text', content: 'Pastors must regularly ask:<br>• Am I still easily convicted by the Word?<br>• Is my conscience tender before God?<br>• Am I moving too quickly to listen?<br>• Have I confused experience with dependence?<br>• Am I spiritually alert or merely functionally efficient?' },
            { type: 'quote', content: '"Keep a close watch on yourself and on the teaching." — 1 Timothy 4:16<br>"Be sober-minded; be watchful." — 1 Peter 5:8' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "A pastor may lose sensitivity gradually, not dramatically — first he stops listening deeply, then he stops noticing, then he starts leading on instinct alone."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What are the warning signs that a pastor is becoming spiritually dull even if outward ministry still seems effective?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Personal Diagnostics and Renewal (46-55 Minutes)' },
            { type: 'text', content: 'Participants should move from biblical reflection to honest self-assessment and concrete renewal. Ask participants to reflect silently or journal on these questions:<br><br>1. <strong>Prayer Leadership:</strong> Is prayer central in my ministry, or mostly occasional and reactive?<br>2. <strong>Word-Centered Ministry:</strong> Am I still feeding on Scripture devotionally, or only studying it professionally?<br>3. <strong>Spiritual Sensitivity:</strong> Is my heart tender before God, or have I become hurried, numb, or self-reliant?<br>4. <strong>Ministry Rhythm:</strong> What spiritual discipline in my life is currently strongest, and which is most neglected?<br>5. <strong>Renewal Need:</strong> What would I need to change in my weekly rhythm for my soul to become healthier before God?' },
            { type: 'text', content: '<strong>Ministry Diagnostic Exercise:</strong><br>Have participants write down:<br>• One practice they need to restore<br>• One distraction they need to reduce<br>• One spiritual rhythm they need to protect' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Prayer is not secondary to pastoral leadership — it is part of the work itself\n- The Word must shape the pastor before it is proclaimed through the pastor\n- Spiritual sensitivity is cultivated through surrender, Scripture, prayer, and obedience\n- Ministry activity is not the same as spiritual vitality\n- Pastoral longevity depends on hidden faithfulness, not visible busyness' },
            { type: 'quote', content: '"Closing Prayer (55-60 Minutes):<br>Lord, teach us to remain with you before we speak for you. Deliver us from empty service, self-reliance, and ministry that runs ahead of your Spirit. Deepen our life of prayer, root us in your Word, and keep our hearts tender before you. Make us shepherds whose public ministry flows from private faithfulness, and whose strength is found in abiding in Christ. In Jesus\' name, Amen."' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> Acts 6:1-7; Psalm 1; John 15:1-8<br>2. <strong>Journal:</strong> Which spiritual discipline in my life has become most neglected, and what has that neglect produced in me?<br>3. <strong>Practice:</strong> Set aside one uninterrupted period this week for prayer and Scripture with no ministry output goal attached to it.<br>4. <strong>Memory Verse:</strong> Acts 6:4' },
            { type: 'flip_card', icon: '🙏', front: 'What is the difference between praying for ministry and praying in ministry?', back: 'Praying FOR ministry treats prayer as preparation for the "real work." Praying IN ministry means prayer IS the work — the primary spiritual act by which God accomplishes His purposes through the shepherd (Acts 6:4).' },
            { type: 'multiple_choice', question: 'In Acts 6:2-4, why did the apostles appoint deacons to handle food distribution?', options: ['They were too busy with administrative tasks', 'To protect their own authority and status', 'So they could devote themselves to prayer and the ministry of the Word', 'Because they disliked practical service work'], correct_index: 2, explanation: 'Acts 6:4 — "But we will devote ourselves to prayer and to the ministry of the word." The apostles understood that their primary calling was spiritual, and delegating administrative tasks freed them to fulfil it.' },
            { type: 'question', content: 'Reflect deeply on your current spiritual disciplines as a pastor or ministry leader. Write a detailed response (minimum 20 characters) answering: Which spiritual discipline (prayer, the Word, or spiritual sensitivity) needs the most intentional renewal in your life, and what concrete steps will you take this week?' }
        ]
    },
    module5: {
        title: "Biblical Preaching",
        subtitle: "Expository preaching, sermon structure, faithful interpretation, and preaching evaluation.",
        components: [
            { type: 'header_h1', content: 'Week 5: Biblical Preaching' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand the biblical mandate and seriousness of preaching God\'s Word.<br>2. Explain the nature and value of expository preaching.<br>3. Recognize the basic elements of a clear and faithful sermon structure.<br>4. Interpret Scripture with greater care, humility, and faithfulness.<br>5. Evaluate whether their preaching is shaped more by the biblical text or by personal opinion, reference, or performance.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction' },
            { type: 'text', content: 'This lesson focuses on one of the pastor\'s most sacred responsibilities: the faithful preaching of Scripture. Week 4 emphasized the pastor\'s inner life of prayer, the Word, and spiritual sensitivity. Week 5 turns to the public ministry that flows from that hidden life. Biblical preaching is not merely speech, inspiration, or religious communication. It is the prayerful, disciplined, faithful proclamation of God\'s Word so that God\'s people may hear, understand, believe, obey, and be transformed.' },
            { type: 'quote', content: '"I charge you in the presence of God and of Christ Jesus... preach the word, be ready in season and out of season, reprove, rebuke, and exhort, with complete patience and teaching."<br>— 2 Timothy 4:1-2' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: 'This lesson should be taught with conviction and realism. Many participants may feel guilt, fear, or uncertainty around preaching. Some may come from churches with little evangelistic clarity. Others may have seen outreach reduced either to pressure tactics or to social activity with no clear gospel message. The aim is to help them lead in a way that is biblically faithful, spiritually alive, and practically wise.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Expository Preaching (5-20 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 2 Timothy 4:1-2</strong><br>"I charge you in the presence of God and of Christ Jesus... preach the word, be ready in season and out of season, reprove, rebuke, and exhort, with complete patience and teaching."' },
            { type: 'header_h3', content: 'A. What Expository Preaching Is' },
            { type: 'text', content: 'Expository preaching begins with a biblical passage, explains its intended meaning in context, and applies that truth to the hearers. The sermon\'s content, structure, and emphasis should arise from the text itself.<br><br><strong>A simple working definition for the class:</strong><br>Expository preaching is preaching in which the main point of the passage becomes the main point of the sermon.' },
            { type: 'header_h3', content: 'B. Why Expository Preaching Matters' },
            { type: 'text', content: 'Expository preaching protects the church from the preacher\'s preferences. It forces the pastor to deal with what God has said rather than what is easiest, trendiest, or most personally appealing. Expository preaching guards the pastor from becoming a religious negotiator with the audience.' },
            { type: 'quote', content: '"All Scripture is breathed out by God..." — 2 Timothy 3:16<br>"I did not shrink from declaring to you the whole counsel of God." — Acts 20:27<br>"They read from the book, from the Law of God, clearly, and they gave the sense, so that the people understood the reading." — Nehemiah 8:8' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'John MacArthur\'s emphasis is especially important here: the authority of preaching lies in the authority of Scripture. If the text is not driving the sermon, the preacher may be sincere, but he is no longer speaking with derived biblical authority.' },
            { type: 'header_h3', content: 'C. Expository Preaching Feeds the Flock' },
            { type: 'text', content: 'Timothy Witmer\'s shepherding lens fits naturally here. Preaching is one of the chief ways pastors feed God\'s people. Sheep need nourishment, not just stimulation. They need truth explained, not merely emotions stirred.' },
            { type: 'quote', content: '"Feed my sheep." — John 21:17<br>"He must hold firm to the trustworthy word as taught, so that he may be able to give instruction in sound doctrine..." — Titus 1:9' },
            { type: 'header_h3', content: 'D. Expository Preaching Requires Patience and Courage' },
            { type: 'text', content: 'Paul says to preach the Word "in season and out of season." This means the preacher must remain faithful whether the message is welcomed or resisted. Expository preaching requires courage because the preacher cannot skip hard truths without weakening the flock.' },
            { type: 'quote', content: '"For the time is coming when people will not endure sound teaching..." — 2 Timothy 4:3<br>"Am I now seeking the approval of man, or of God?" — Galatians 1:10' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> Use this statement: "Topical preaching often asks, \'What do I want to say?\' Expository preaching begins by asking, \'What has God said here?\'"' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What are the greatest temptations that pull preachers away from genuine exposition?<br><br>Possible answers to draw out:<br>• desire to impress<br>• fear of difficult truths<br>• laziness in study<br>• dependence on stories<br>• pressure to be relevant in worldly ways<br>• preaching personal burdens without textual grounding' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Sermon Structure (20-35 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Timothy 4:13; 2 Timothy 4:2</strong><br>"Until I come, devote yourself to the public reading of Scripture, to exhortation, to teaching."<br>"Preach the word... with complete patience and teaching."' },
            { type: 'header_h3', content: 'A. Structure Serves Clarity' },
            { type: 'text', content: 'A sermon should not feel like scattered reflections. Structure helps listeners follow the text, grasp the message, and respond appropriately. Sermon organization is not merely a public speaking skill — it helps the congregation receive the truth more fruitfully. Explain that if the preacher is confused, the people will be confused. Clarity is pastoral care.' },
            { type: 'header_h3', content: 'B. Basic Elements of a Faithful Sermon' },
            { type: 'text', content: 'A helpful sermon structure may include:<br><br>1. <strong>Introduction</strong> — Introduces the text, theme, question, tension, or need; Gains attention without distracting from Scripture; Moves naturally into the biblical text.<br><br>2. <strong>Reading of the Text</strong> — The text should be read clearly and reverently; The congregation must know what passage governs the sermon.<br><br>3. <strong>Explanation / Exposition</strong> — What does the passage say?; What does it mean in context?; What is the author\'s main point?<br><br>4. <strong>Illustration</strong> — Clarifies truth, not replaces it; Serves understanding and retention; Must support the text rather than dominate the sermon.<br><br>5. <strong>Application</strong> — How should this truth affect belief, behavior, worship, relationships, repentance, or hope?; Application should arise from the meaning of the text.<br><br>6. <strong>Conclusion</strong> — Reinforces the sermon\'s main truth; Calls for response; Ends with clarity, not unnecessary repetition.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Stress that structure is a servant, not the master. Some sermons may follow three points, some two, some one organizing central movement. The issue is not forced formality, but whether the structure helps the hearers track the text faithfully.' },
            { type: 'header_h3', content: 'C. The Main Point of the Sermon Should Match the Main Point of the Passage' },
            { type: 'text', content: 'This is one of the most important principles in sermon construction. If the sermon emphasizes what the text does not emphasize, the preacher may sound biblical while actually misrepresenting the passage.' },
            { type: 'quote', content: '"Do your best to present yourself to God as one approved... rightly handling the word of truth." — 2 Timothy 2:15' },
            { type: 'text', content: 'Encourage participants to ask during preparation:<br>• What is the central burden of this passage?<br>• What truth or the author present to the hearers?<br>• What should the people remember if they forget everything else?' },
            { type: 'header_h3', content: 'D. A Clear Sermon Usually Needs One Controlling Idea' },
            { type: 'text', content: 'A sermon overloaded with many unrelated points often weakens impact. A focused sermon helps the people remember and respond.<br><br>A helpful formula for participants:<br>Text → Main Idea → Outline → Explanation → Application' },
            { type: 'header_h3', content: 'E. Application Must Be Specific and Text-Shaped' },
            { type: 'text', content: 'Application is not a generic moral lesson added at the end. It should emerge naturally from the passage. Faithful preaching addresses the mind, heart, and will.' },
            { type: 'text', content: 'Different passages produce different kinds of application:<br>• some call for repentance<br>• some call for endurance<br>• some call for worship<br>• some call for trust<br>• some call for doctrinal clarity<br>• some call for relational obedience' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Peter Scazzero\'s insight can help here: some preaching explains truth accurately but applies it superficially because it never reaches the deeper motives, fears, or wounds of the heart. Good application is not only behavioral; it is spiritual and relational.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Which part of sermon structure do preachers most often neglect — introduction, explanation, illustration, application, or conclusion? Why?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Interpreting Scripture Faithfully (35-48 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 2 Timothy 2:15; 2 Peter 1:20-21</strong><br>"Do your best to present yourself to God as one approved... rightly handling the word of truth."<br>"No prophecy of Scripture comes from someone\'s own interpretation..."' },
            { type: 'header_h3', content: 'A. The Goal of Interpretation is to Discover the Author\'s Intended Meaning' },
            { type: 'text', content: 'Faithful interpretation asks: What did this passage mean in its original context, and how does that meaning apply truthfully today? We do not begin with what the text means to me personally; we begin with what God communicated through the human author.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Clarify that personal application matters deeply, but application must rest on interpretation. If the meaning is unstable, the application will be unstable.' },
            { type: 'header_h3', content: 'B. Read the Text in Context' },
            { type: 'text', content: 'One of the most common preaching mistakes is lifting verses out of context. Every text belongs to a paragraph, a book, a covenant setting, a historical moment, and the larger story of Scripture. Encourage participants to ask:<br>• What comes before and after this passage?<br>• Who is speaking?<br>• Who is being addressed?<br>• What issue is being addressed?<br>• What is the literary form?<br>• How does this fit within the book\'s larger argument?' },
            { type: 'quote', content: '"Beginning with Moses and all the Prophets, he interpreted to them in all the Scriptures the things concerning himself." — Luke 24:27<br>"Then he opened their minds to understand the Scriptures." — Luke 24:45' },
            { type: 'header_h3', content: 'C. Let Scripture Interpret Scripture' },
            { type: 'text', content: 'Clearer passages often help explain harder ones. The Bible is coherent because it is inspired by one divine Author.' },
            { type: 'quote', content: '"All Scripture is breathed out by God..." — 2 Timothy 3:16' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: This principle protects from building doctrine on isolated or unclear verses while ignoring the broader witness of Scripture.' },
            { type: 'header_h3', content: 'D. Observe Before You Conclude' },
            { type: 'text', content: 'Teach participants to move through a simple sequence:<br>1. <strong>Observation</strong> — What does the text say?<br>2. <strong>Interpretation</strong> — What does the text mean?<br>3. <strong>Application</strong> — How should this truth shape life today?' },
            { type: 'header_h3', content: 'E. Beware Common Interpretive Errors' },
            { type: 'text', content: 'List and explain several dangers:<br>• <strong>Proof-texting</strong> — using verses out of context to support a point<br>• <strong>Allegorizing without restraint</strong> — inventing hidden meanings not grounded in the text<br>• <strong>Moralizing</strong> — reducing every passage to "try harder"<br>• <strong>Self-context reading</strong> — reading the text mainly about the hearer\'s success rather than God\'s revelation<br>• <strong>Ignoring genre</strong> — treating poetry, narrative, prophecy, epistle, and wisdom literature as though they function the same way' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'John MacArthur\'s emphasis on grammatical-historical interpretation is useful here: the preacher must ask what the words meant in their setting before moving to modern application.' },
            { type: 'header_h3', content: 'F. Faithful Interpretation Requires Humility' },
            { type: 'text', content: 'Preachers must come to Scripture as servants, not controllers. The text is not ours to reshape. We are under the Word before we preach the Word.' },
            { type: 'quote', content: '"For who has known the mind of the Lord?" — Romans 11:34<br>"The unfolding of your words gives light..." — Psalm 119:130' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Personal Diagnostics and Preaching Evaluation (48-57 Minutes)' },
            { type: 'text', content: 'Participants should examine their own preaching habits honestly and identify concrete areas for growth. Ask participants to reflect silently or journal through these questions:<br><br>1. <strong>Text Fidelity:</strong> Do my sermons clearly arise from the passage I am preaching?<br>2. <strong>Exposition:</strong> Do I explain the meaning of the text, or do I move too quickly to my own ideas?<br>3. <strong>Structure:</strong> Are my sermons organized clearly enough to help people follow and remember the message?<br>4. <strong>Interpretation:</strong> Do I handle context carefully, or am I sometimes too quick to use verses loosely?<br>5. <strong>Heart Posture:</strong> When I preach, am I trying to feed the flock, prove myself, move emotions, or display knowledge?<br>6. <strong>Discipleship:</strong> Does my preaching lead people toward repentance, faith, worship, obedience, and Christlikeness?' },
            { type: 'text', content: '<strong>Preaching Diagnostic Exercise:</strong><br>Have participants write down:<br>• One strength in their current preaching<br>• One weakness in their sermon preparation<br>• One practice they need to begin immediately to grow in faithfulness' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Biblical preaching begins with the command to preach the Word\n- Expository preaching lets the text set the message\n- Clear sermon structures serve faithful communication\n- Faithful preaching depends on faithful interpretation\n- The preacher is a steward under the authority of Scripture\n- Good preaching feeds, clarifies, convicts, and forms God\'s people' },
            { type: 'quote', content: '"Closing Prayer:<br>Lord, make us faithful stewards of your Word. Keep us from carelessness, pride, and distortion. Teach us to preach the text clearly, structure sermons wisely, interpret Scripture faithfully, and feed your people with truth. May our preaching honor Christ, strengthen the church, and bring conviction, hope, and transformation through the power of your Spirit. In Jesus\' name, Amen."' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> 2 Timothy 3:14-17; 2 Timothy 4:1-5; Nehemiah 8:1-8<br>2. <strong>Journal:</strong> In what ways do my preaching show faithfulness to the text, and where am I most vulnerable to drifting from it?<br>3. <strong>Practice:</strong> Take one short passage and write its main idea in one sentence before outlining a sermon from it.<br>4. <strong>Memory Verse:</strong> 2 Timothy 4:2' },
            { type: 'matching', pairs: [{ left: 'Expository Preaching', right: 'Text of Scripture shapes the structure and content of the message' }, { left: 'Topical Preaching', right: 'A theme is explored using multiple passages' }, { left: 'Exegesis', right: 'Drawing meaning OUT of the text' }, { left: 'Eisegesis', right: 'Reading meaning INTO the text — a dangerous error' }] },
            { type: 'true_false', statement: 'A preacher\'s primary responsibility is to make the sermon relevant and engaging to the modern audience.', correct: false, explanation: 'The preacher\'s primary responsibility is faithfulness to the biblical text. Relevance follows from faithful exposition — not from bending the text to fit cultural expectations. As John MacArthur writes, "The text itself is relevant; the preacher\'s job is to unleash it."' },
            { type: 'question', content: 'Reflect honestly on your current preaching practice. Write a detailed response (minimum 20 characters) answering: What is one specific change you will make in how you prepare or deliver sermons to ensure the biblical text, not your personal preferences, shapes your preaching?' }
        ]
    },
    module6: {
        title: "Pastoral Care",
        subtitle: "Biblical counseling, visiting the sick, crisis care, and the theology of pastoral presence.",
        components: [
            { type: 'header_h1', content: 'Week 6: Pastoral Care' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand pastoral care as a central responsibility of shepherd leadership.<br>2. Recognize the basic principles of biblical counseling and spiritual care.<br>3. Develop practical wisdom for visiting the sick, the grieving, and the distressed.<br>4. Respond more faithfully in moments of crisis, suffering, and urgent need.<br>5. Discern the difference between pastoral care, practical help, spiritual counsel, and situations requiring outside support.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction' },
            { type: 'text', content: 'This lesson moves from preaching and spiritual disciplines into one of the most personal dimensions of ministry: pastoral care. If shepherding is not only public proclamation, it is also private presence. Pastors are called to know the flock, feed the flock, lead the flock, and protect the flock. Pastoral care often takes place away from microphones and platforms — in homes, hospital rooms, counseling conversations, funeral settings, family tensions, seasons of grief, and moments of crisis.' },
            { type: 'quote', content: '"Admonish the idle, encourage the fainthearted, help the weak, be patient with them all."<br>— 1 Thessalonians 5:14' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: 'The heart of pastoral care is not merely solving problems. It is bringing the presence, truth, comfort, wisdom, and care of Christ to people in weakness, suffering, confusion, sin, and need. In 1 Thessalonians 5:14, Paul gives a compact but powerful pastoral framework: "Admonish the idle, encourage the fainthearted, help the weak, be patient with them all." This single verse reminds us that people do not all need the same response. Faithful pastoral care requires discernment.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Theology and Scope of Pastoral Care (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Thessalonians 5:14</strong><br>"And we urge you, brothers, admonish the idle, encourage the fainthearted, help the weak, be patient with them all."' },
            { type: 'header_h3', content: 'A. Pastoral Care is Part of Shepherding, Not Separate From It' },
            { type: 'text', content: 'Pastoral care is not something added to "real ministry." It is one of the clearest ways shepherd leadership is expressed. A shepherd does not only teach the flock; he also watches over, tends, protects, restores, and helps the sheep.' },
            { type: 'quote', content: '"Pay careful attention to yourselves and to all the flock..." — Acts 20:28<br>"Shepherd the flock of God that is among you..." — 1 Peter 5:2<br>"The weak you have not strengthened, the sick you have not healed, the injured you have not bound up..." — Ezekiel 34:4' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Timothy Witmer here: his four shepherding functions — know, feed, lead, protect — provide an excellent framework. Pastoral care often happens where all four functions meet.' },
            { type: 'header_h3', content: 'B. Different People Require Different Kinds of Care' },
            { type: 'text', content: 'Paul gave four different pastoral responses:<br>• <strong>Admonish the idle</strong> — some need warning and correction<br>• <strong>Encourage the fainthearted</strong> — some need reassurance and courage<br>• <strong>Help the weak</strong> — some need support and steady assistance<br>• <strong>Be patient with them all</strong> — all require patience' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'This is one of the most important principles in pastoral care: not every person should be approached in the same way. The wise shepherd learns to distinguish rebellion from weakness, immaturity from grief, and confusion from defiance.' },
            { type: 'header_h3', content: 'C. Pastoral Care Reflects the Character of Christ' },
            { type: 'text', content: 'Jesus was truthful and tender. He confronted hypocrisy, welcomed the weary, wept with the grieving, touched the unclean, restored the fallen, and cared for those overlooked by others.' },
            { type: 'quote', content: '"A bruised reed he will not break, and a faintly burning wick he will not quench." — Isaiah 42:3<br>"When Jesus saw her weeping... he was deeply moved in his spirit and greatly troubled." — John 11:33' },
            { type: 'callout', emoji: '⚠️', bg: 'soft-red', content: 'Pastoral care must not become cold management or sentimental softness. Christlike care is compassionate, holy, courageous, and truthful.' },
            { type: 'header_h3', content: 'D. Patience is Essential to Pastoral Care' },
            { type: 'text', content: 'People grow slowly. Some burdens are not resolved in one conversation. The pastor must resist frustration, hasty complexes, and the desire to force quick outcomes.' },
            { type: 'quote', content: '"Be patient with them all." — 1 Thessalonians 5:14<br>"With all humility and gentleness, with patience..." — Ephesians 4:2' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Counseling Basics (18-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Galatians 6:1-2</strong><br>"Brothers, if anyone is caught in any transgression, you who are spiritual should restore him in a spirit of gentleness. Bear one another\'s burdens, and so fulfill the law of Christ."' },
            { type: 'header_h3', content: 'A. Pastoral Counseling Begins With Listening Well' },
            { type: 'text', content: 'Before speaking, the pastor must listen carefully. Many poor counseling moments happen because the pastor gives answers too quickly, assumes too much, or listens only for a problem to solve.' },
            { type: 'quote', content: '"If one gives an answer before he hears, it is his folly and shame." — Proverbs 18:13<br>"The purpose in a man\'s heart is like deep water, but a man of understanding will draw it out." — Proverbs 20:5' },
            { type: 'header_h3', content: 'B. Counseling Aims at Restoration, Not Control' },
            { type: 'text', content: 'Galatians 6 emphasizes restoration in gentleness. The pastor is not a courtroom judge trying to win a case, but a shepherd seeking restoration, experience, clarity, and growth.' },
            { type: 'quote', content: '"Restore him in a spirit of gentleness." — Galatians 6:1<br>"The Lord\'s servant must not be quarrelsome but kind to everyone..." — 2 Timothy 2:24' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'John MacArthur\'s emphasis helps here: pastoral counsel should be biblical rather than merely opinion-based. Yet truth must be delivered with gentleness and wisdom, not blunt force.' },
            { type: 'header_h3', content: 'C. Good Pastoral Counseling Usually Includes These Elements' },
            { type: 'bullet_list', content: '- Listening — understanding the person\'s situation\n- Discernment — asking what is really happening spiritually and relationally\n- Scripture — bringing biblical truth to bear appropriately\n- Prayer — inviting God into the conversation openly\n- Encouragement or correction — depending on the need\n- Practical next steps — small, wise, realistic steps toward change or stability\n- Follow-up — continued care where needed' },
            { type: 'header_h3', content: 'D. Know the Limits of Pastoral Counseling' },
            { type: 'text', content: 'Pastors provide spiritual guidance, biblical counsel, moral clarity, and relational support. But not every situation can be handled by one conversation or by pastoral care alone. Some situations require medical, legal, psychiatric, trauma-informed, or specialized help beyond the pastor\'s competence.' },
            { type: 'callout', emoji: '⚠️', bg: 'soft-red', content: 'This is a critical maturity point. Knowing your limits is not failure; it is wisdom. Referral or additional support may be necessary in situations such as abuse, severe mental health crisis, addiction, suicidal statements, criminal behavior, domestic violence, or psychosis.' },
            { type: 'header_h3', content: 'E. Confidentiality Requires Wisdom' },
            { type: 'text', content: 'People must feel safe to share sensitive matters. At the same time, confidentiality is not absolute if someone is in danger, being abused, threatening harm, or involving criminal wrongdoing.' },
            { type: 'header_h3', content: 'F. Avoid Common Counseling Mistakes' },
            { type: 'bullet_list', content: '- Speaking too quickly\n- Overcommising\n- Trying to fix everything immediately\n- Taking sides too fast in conflicts\n- Using Scripture like a weapon\n- Confusing sympathy with wisdom\n- Becoming emotionally entangled or overly controlling\n- Failing to follow up' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Peter Scazzero\'s contribution is vital here. Emotionally immature leaders often rush, react, defensively, avoid deep pain, or give spiritual answers instead of the actual struggle.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What is usually harder in counseling — knowing what to say, or slowing down enough to hear what is really happening?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Visiting the Sick and Suffering (30-40 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: James 5:14; Romans 12:15</strong><br>"Is anyone among you sick? Let him call for the elders of the church..."<br>"Rejoice with those who rejoice, weep with those who weep."' },
            { type: 'header_h3', content: 'A. Presence Matters Deeply' },
            { type: 'text', content: 'In illness and suffering, the pastor\'s ministry is often less about long speeches and more about faithful presence. To show up is itself a form of care.' },
            { type: 'quote', content: '"I was sick and you visited me." — Matthew 25:36<br>"The Lord is near to the brokenhearted." — Psalm 34:18' },
            { type: 'header_h3', content: 'B. Pray, Read Scripture, and Speak With Gentleness' },
            { type: 'text', content: 'A helpful sick visitation often includes:<br>• brief, warm conversation<br>• listening to the person\'s fears or hopes<br>• reading a short fitting passage<br>• praying specifically and simply<br>• avoiding forced cheerfulness or heavy speeches<br><br>Suitable Scriptures for visits may include:<br>• Psalm 23<br>• Psalm 46<br>• Isaiah 41:10<br>• Matthew 11:28-30<br>• Romans 8:38-39<br>• 2 Corinthians 1:3-4' },
            { type: 'header_h3', content: 'C. Avoid Unhelpful Responses in Suffering' },
            { type: 'text', content: 'The pastor should avoid:<br>• making promises God has not made<br>• implying that sickness is always caused by personal sin<br>• offering theological clichés too quickly<br>• talking too much<br>• centering the visit on himself' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Job\'s friends became most harmful when they moved too quickly from presence to explanation.' },
            { type: 'header_h3', content: 'D. Care for Family as Well as Patient' },
            { type: 'text', content: 'Illness affects spouses, children, caregivers, and extended family. Often those around the suffering person are exhausted, afraid, and overlooked.' },
            { type: 'quote', content: '"Bear one another\'s burdens..." — Galatians 6:2<br>"Comfort those who are in any affliction..." — 2 Corinthians 1:4' },
            { type: 'header_h3', content: 'E. Grief Ministry is Part of Pastoral Care' },
            { type: 'text', content: 'Not every visit is about healing; some are about grief, loss, or death. The pastor must learn to be present in sorrow without trying to rush people past it.' },
            { type: 'quote', content: '"Jesus wept." — John 11:35<br>"Blessed are those who mourn..." — Matthew 5:4' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "In hospital rooms and grief settings, a pastor\'s presence often preaches before his words do."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What kinds of words or attitudes are most harmful when caring for someone who is sick or grieving?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Crisis Pastoral Care (40-50 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Psalm 46:1; 2 Corinthians 1:3-4</strong><br>"God is our refuge and strength, a very present help in trouble."<br>"...who comforts us in all our affliction, so that we may be able to comfort those who are in any affliction..."' },
            { type: 'header_h3', content: 'A. Crisis Care Requires Calm Presence' },
            { type: 'text', content: 'During crises — death, accident, violence, severe conflict, moral failure, panic, or shocking news — people often need steady presence before they can process instruction. The pastor\'s calm can serve as a stabilizing mercy.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: In crisis, do not begin by trying to explain everything. First stabilize, pray, listen, clarify facts, and assess immediate needs.' },
            { type: 'header_h3', content: 'B. Initial Priorities in Crisis Pastoral Care' },
            { type: 'text', content: 'A helpful order may be:<br>1. Ensure immediate safety<br>2. Be physically and emotionally present<br>3. Pray briefly and sincerely<br>4. Gather accurate information<br>5. Avoid speculation<br>6. Involve appropriate support people<br>7. Provide spiritual and practical guidance<br>8. Plan follow-up care' },
            { type: 'header_h3', content: 'C. Crisis Care Requires Truth and Tenderness' },
            { type: 'text', content: 'The pastor must avoid both cold distance and dramatic overreaction. He must speak truthfully, avoid false promises, and resist trying to control outcomes.' },
            { type: 'quote', content: '"Speak the truth in love..." — Ephesians 4:15<br>"A bruised reed he will not break." — Isaiah 42:3' },
            { type: 'header_h3', content: 'D. Some Crises Involve Sin; Others Involve Suffering; Some Involve Both' },
            { type: 'text', content: 'Pastors must discern whether the crisis is mainly:<br>• grief and loss<br>• traumatic suffering<br>• relational breakdown<br>• moral failure<br>• mental or emotional collapse<br>• danger requiring external intervention<br><br>The pastoral response changes accordingly.' },
            { type: 'header_h3', content: 'E. The Pastor Must Know When to Call for Help' },
            { type: 'text', content: 'High-risk situations may require immediate involvement of family, elders, medical professionals, emergency services, legal authorities, or trained counselors.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'This is not a lack of faith. It is part of wise shepherding. A pastor should never handle dangerous situations alone out of pride or fear of appearing insufficient.' },
            { type: 'header_h3', content: 'F. Follow-Up is Essential After Crisis' },
            { type: 'text', content: 'Some pastors respond well in the first moment but disappear too soon afterward. Crisis care continues after the emergency passes.' },
            { type: 'header_h3', content: 'Practical Crisis Categories to Mention' },
            { type: 'bullet_list', content: '- sudden death or bereavement\n- accidents or hospitalization\n- marital breakdown\n- mental failure in leadership\n- abuse disclosure\n- suicidal statements\n- family violence\n- congregational conflict after traumatic events' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What are the greatest dangers for pastors in crisis situations — panic, overconfidence, poor boundaries, false reassurance, or failure to involve others?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Additional Dimensions of Pastoral Care and Personal Diagnostics (50-57 Minutes)' },
            { type: 'header_h3', content: 'A. Care for the Grieving' },
            { type: 'bullet_list', content: '- funerals\n- bereavement follow-up\n- anniversaries of loss\n- long-term grief support' },
            { type: 'header_h3', content: 'B. Care for the Elderly and Homebound' },
            { type: 'bullet_list', content: '- regular visitation\n- inclusion in church life\n- guarding against neglect and invisibility' },
            { type: 'header_h3', content: 'C. Care in Conflict and Reconciliation' },
            { type: 'text', content: '• helping people pursue truth, repentance, forgiveness, and peace<br>• refusing gossip and partiality' },
            { type: 'header_h3', content: 'D. Care for the Discouraged and Weary' },
            { type: 'bullet_list', content: '- burnout\n- spiritual dryness\n- disappointments in ministry or family\n- quiet despair' },
            { type: 'quote', content: '"Encourage the fainthearted..." — 1 Thessalonians 5:14' },
            { type: 'header_h3', content: 'E. Care Through Practical Support and Mobilizing the Body' },
            { type: 'text', content: 'Pastoral care does not mean the pastor personally does every act of mercy. Often pastoral care includes mobilizing deacons, small group leaders, women\'s ministry, mercy teams, or trusted members to support the person in need.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Connect this to Week 3. The pastor equips the saints; he does not replace the body. Wise pastoral care often activates the church\'s gifts.' },
            { type: 'text', content: '<strong>Personal Reflection Exercise:</strong><br>Ask participants to reflect silently or journal on these questions:<br><br>1. <strong>Counseling:</strong> Do I listen well, or do I rush toward answers?<br>2. <strong>Visitation:</strong> Am I present with the sick, grieving, and weak, or do I avoid those spaces?<br>3. <strong>Crisis Care:</strong> How do I usually respond under pressure — calmly, fearfully, reactively, or wisely?<br>4. <strong>Discernment:</strong> Do I distinguish between the idle, the fainthearted, and the weak?<br>5. <strong>Limits:</strong> Do I know when a situation requires additional help beyond my own role?<br>6. <strong>Body Ministry:</strong> Am I equipping the church to share in care, or carrying it all alone?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Pastoral care is central to shepherding, not secondary to it\n- Different people require different forms of care\n- Counseling begins with listening and aims at restoration\n- Visiting the sick and grieving requires presence, prayer, and gentleness\n- Crisis care requires calm, discernment, safety, and follow-up\n- Wise pastors know both their responsibilities and their limits\n- Pastoral care is strengthened when the whole church is equipped to care well' },
            { type: 'quote', content: '"Closing Prayer:<br>Lord Jesus, Chief Shepherd, make us tender without becoming weak, truthful without becoming harsh, and courageous without becoming self-reliant. Teach us to care for the hurting, guide the confused, strengthen the weak, and stand steady in crisis. Give us wisdom to know people well, love them faithfully, and serve them in ways that reflect your compassion and truth. In your name we pray. Amen."' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> 1 Thessalonians 5:12-22; Galatians 6:1-5; James 5:13-16<br>2. <strong>Journal:</strong> Which area of pastoral care comes most naturally to me, and which do I tend to avoid?<br>3. <strong>Practice:</strong> Make one intentional pastoral care contact this week — visit, call, pray, or follow up with someone who is weak, grieving, or sick.<br>4. <strong>Ministry Audit:</strong> Identify one care burden you should share more wisely with trained leaders in the church.<br>5. <strong>Memory Verse:</strong> 1 Thessalonians 5:14' },
            { type: 'accordion', items: [{ title: 'Knowing — Personal connection', content: 'The shepherd knows the flock by name. John 10:14 — "I am the good shepherd. I know my own and my own know me." Pastoral care begins with genuine personal knowledge of each person.' }, { title: 'Feeding — Spiritual nourishment', content: 'Regular teaching, personal study encouragement, and Scripture-based counseling keep the flock spiritually healthy.' }, { title: 'Leading — Guiding toward God\'s purposes', content: 'The shepherd helps individuals discern God\'s direction, make wise decisions, and navigate life transitions.' }, { title: 'Protecting — Guarding from error and harm', content: 'False teaching, divisive people, and spiritual deception are real threats. The shepherd protects by teaching discernment and addressing error directly.' }] },
            { type: 'flip_card', icon: '🏥', front: 'What is the goal of pastoral counseling?', back: 'Not merely symptom management, but soul restoration — helping people understand their situation through a biblical lens, encounter Christ in their pain, and grow toward Christlikeness (Romans 8:28-29).' },
            { type: 'question', content: 'Reflect honestly on your current pastoral care practice. Write a detailed response (minimum 20 characters) answering: In what area of pastoral care (counseling, visitation, crisis response, or mobilizing the church body) do you feel least equipped, and what specific step will you take to grow in that area?' }
        ]
    },
    module7: {
        title: "Discipleship Systems",
        subtitle: "Theology and purpose of discipleship, reproducing leaders, the mentorship model of Jesus, and small group leadership.",
        components: [
            { type: 'header_h1', content: 'Week 7: Discipleship Systems' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand discipleship as a deliberate, reproducible ministry responsibility rather than a vague church activity.<br>2. Recognize that healthy discipleship systems help form mature and reproduce future leaders.<br>3. Learn from the mentorship model of Jesus in how He called, taught, shaped, sent, and restored His disciples.<br>4. Develop practical wisdom for building and leading small groups as environments for spiritual formation.<br>5. Discern the difference between attendance, information transfer, spiritual formation, and leader multiplication.<br>6. Evaluate whether their current ministry structure actually produces disciples who can disciple others.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction' },
            { type: 'text', content: 'This lesson moves from pastoral care into the intentional formation of people through discipleship systems. If pastoral care helps sustain ministry, discipleship helps form mature people, multiply leaders, and reproduce the church. Churches do not become strong by gathering crowds or delivering sermons. They become strong when people are steadily formed as followers of Christ who obey Him, grow in community, serve faithfully, and help others do the same.' },
            { type: 'quote', content: '"...and what you have heard from me in the presence of many witnesses entrust to faithful men, who will be able to teach others also."<br>— 2 Timothy 2:2' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: 'A discipleship system is not merely a curriculum or a meeting schedule. It is an intentional pathway by which people are moved from conversion toward maturity, mission, and multiplication. This means discipleship must be personal, biblical, relational, structured, and reproducible.<br><br>This lesson should especially emphasize three dimensions:<br>• <strong>Reproducing leaders</strong> — discipleship must aim beyond personal growth toward multiplication<br>• <strong>Following Jesus</strong> — Jesus discipled through presence, teaching, example, correction, mission, and relationship<br>• <strong>Small group leadership</strong> — discipleship often becomes most practical and sustainable in smaller relational environments' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Theology and Purpose of Discipleship Systems (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 2 Timothy 2:2</strong><br>"...and what you have heard from me in the presence of many witnesses entrust to faithful men, who will be able to teach others also."' },
            { type: 'header_h3', content: 'A. Discipleship is Central to the Mission of the Church' },
            { type: 'text', content: 'Jesus did not command the church merely to gather converts, but to make disciples.' },
            { type: 'quote', content: '"Go therefore and make disciples of all nations..." — Matthew 28:19<br>"teaching them to observe all that I have commanded you" — Matthew 28:20' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Discipleship includes evangelism, but it goes beyond evangelism. It is not complete when someone professes faith. It continues as believers are taught to obey Christ in the whole of life.' },
            { type: 'header_h3', content: 'B. Discipleship Must be Intentional, Not Accidental' },
            { type: 'text', content: 'Discipleship cannot be encouraged by many ordinary church activities, but mature disciples are rarely produced through randomness alone. Churches need pathways, habits, relationships, and structures that help people grow.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'A discipleship system is simply an intentional framework that helps people move toward maturity. It need not be complicated, but it must be clear.' },
            { type: 'header_h3', content: 'C. Biblical Discipleship Aims at Obedience, Not Information Alone' },
            { type: 'text', content: 'Knowledge matters, but biblical knowledge is meant to shape life. The goal is not merely informed minds, but transformed people.' },
            { type: 'quote', content: '"teaching them to observe all that I have commanded you" — Matthew 28:20<br>"Him we proclaim, warning everyone and teaching everyone with all wisdom, that we may present everyone mature in Christ." — Colossians 1:28' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'A church may have many hearers and still lack mature disciples. Information without obedience can create the illusion of growth.' },
            { type: 'header_h3', content: 'D. Discipleship Should Be Relational as Well as Instructional' },
            { type: 'text', content: 'Paul did not only deliver messages; he shared life. Jesus did not only preach sermons; He lived among His disciples.' },
            { type: 'quote', content: '"we were gentle among you, like a nursing mother taking care of her own children" — 1 Thessalonians 2:7<br>"you know how, like a father with his children, we exhorted each one of you" — 1 Thessalonians 2:11' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Discipleship is strongest when truth is seen embedded in real relationships. People learn not only from what leaders say, but from how leaders live.' },
            { type: 'header_h3', content: 'E. Systems Serve People When They Support Faithful Formation' },
            { type: 'text', content: 'Some people resist systems because they fear formalism. That concern can be valid. Yet the answer to poor structure is not no structure. Good systems serve spiritual life rather than replacing it.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "A discipleship system is not a machine for producing Christians. It is a trellis that helps living growth take shape."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do churches often confuse activity with discipleship, and what is usually missing most when true formation does not happen?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Reproducing Leaders (18-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 2 Timothy 2:2</strong><br>"...entrust to faithful men, who will be able to teach others also."' },
            { type: 'text', content: 'Participants should see that mature discipleship is not complete until it includes multiplication — the raising up of others who can teach, lead, and disciple.' },
            { type: 'header_h3', content: 'A. Reproduction is Part of Biblical Discipleship' },
            { type: 'text', content: 'Paul describes a chain of transmission: from Paul, to Timothy, to faithful people, to others also. This is more than personal mentoring; it is intentional multiplication.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Leadership that does not reproduce eventually becomes a bottleneck. A ministry may depend too much on one gifted person if it never trains others.' },
            { type: 'header_h3', content: 'B. Reproducing Leaders Requires Entrusting Truth to Faithful People' },
            { type: 'text', content: 'Not every person is ready for the same level of responsibility. Leaders must identify faithfulness, teachability, humility, and reliability.' },
            { type: 'quote', content: '"The things that you have heard from me... entrust to faithful men." — 2 Timothy 2:2<br>"...it is required of stewards that they be found faithful." — 1 Corinthians 4:2' },
            { type: 'header_h3', content: 'C. Developing Leaders Involves More Than Delegating Tasks' },
            { type: 'text', content: 'Some churches assign responsibilities without truly forming leaders. But handing out work is not the same as reproducing people.' },
            { type: 'text', content: 'A developing leader usually needs:<br>1. Instruction — sound doctrine and biblical understanding<br>2. Observation — seeing ministry modeled<br>3. Participation — serving under guidance<br>4. Correction — honest feedback and redirection<br>5. Responsibility — increasing trust over time<br>6. Accountability — character and doctrine being watched carefully<br>7. Commissioning — being sent to serve others fruitfully' },
            { type: 'header_h3', content: 'D. Jesus Invested Deeply in a Smaller Circle' },
            { type: 'text', content: 'Though Jesus ministered to crowds, he gave focused attention to the Twelve, and even more intimate formation to Peter, James, and John in particular moments.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'This corrects the idea that wider influence is always better than deeper investment. Some of the most strategic ministry a leader can do is to shape a few people well.' },
            { type: 'header_h3', content: 'E. Reproducing Leaders Requires Patience' },
            { type: 'text', content: 'Leaders are not produced instantly. The apostles themselves were slow to understand, often weak, and frequently corrected. Yet Jesus committed to their formation.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'A church that expects finished leaders too quickly may either become controlling or lower its standards. Faithful multiplication takes time.' },
            { type: 'header_h3', content: 'F. Reproduction Protects the Future of the Church' },
            { type: 'text', content: 'Churches become fragile when ministry depends entirely on one pastor, one teacher, or one personality. Reproducing leaders strengthens continuity, resilience, and mission.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "A leader has not finished his work when people admire him. He moves toward completion when faithful people are able to carry truth and ministry forward."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do leaders sometimes prefer doing ministry themselves rather than reproducing others to do it?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: The Mentorship Model of Jesus (30-40 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Mark 3:13-15</strong><br>"And he called to him those whom he desired... And he appointed twelve... so that they might be with him and he might send them out to preach."' },
            { type: 'text', content: 'Participants should learn from Jesus\' model of discipleship as a pattern of presence, instruction, example, correction, mission, and ongoing formation.' },
            { type: 'header_h3', content: 'A. The Disciples Were First Called to Be With Him' },
            { type: 'text', content: 'The disciples were first called to be with Jesus. Before they were sent out, they spent time in His presence, watching His life and hearing His teaching.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Discipleship weakens when leaders want output without relationship. Presence builds trust, context, and credibility.' },
            { type: 'header_h3', content: 'B. Jesus Taught Both Publicly and Privately' },
            { type: 'text', content: 'Jesus preached to crowds, but He often explained things more deeply to His disciples.' },
            { type: 'quote', content: '"he explained everything privately to his own disciples" — Mark 4:34' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'This shows that public teaching and personal formation are not enemies. They serve different functions.' },
            { type: 'header_h3', content: 'C. Jesus Modeled the Life He Commanded' },
            { type: 'text', content: 'He did not merely command prayer, humility, love, service, sacrifice, and obedience. He embodied them.' },
            { type: 'quote', content: '"For I have given you an example, that you also should do just as I have done to you." — John 13:15' },
            { type: 'header_h3', content: 'D. Jesus Asked Questions and Exposed the Heart' },
            { type: 'text', content: 'He did not only lecture. He drew out motives, tested understanding, confronted pride, and invited reflection.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Mentorship is not merely downloading content. It involves helping people see themselves truthfully before God.' },
            { type: 'header_h3', content: 'E. Jesus Gave Ministry Opportunities with Guidance' },
            { type: 'text', content: 'He sent disciples out to minister, then received them back, heard their reports, and continued shaping them.' },
            { type: 'quote', content: '"And he called the twelve together and gave them power and authority..." — Luke 9:1<br>"After this the Lord appointed seventy-two others and sent them on ahead of him..." — Luke 10:1' },
            { type: 'header_h3', content: 'F. Jesus Corrected and Restored His Disciples' },
            { type: 'text', content: 'He rebuked wrong thinking, corrected ambition, and restored failure — most notably in Peter\'s case.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'True mentorship includes both encouragement and correction. A leader who never corrects does not truly form people.' },
            { type: 'header_h3', content: 'G. Jesus Discipled Toward Mission, Not Dependence' },
            { type: 'text', content: 'His goal was not to keep disciples permanently dependent on His immediate presence in the same way, but to prepare them to continue His mission faithfully.' },
            { type: 'quote', content: '"As the Father has sent me, even so I am sending you." — John 20:21' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Jesus did not merely gather students. He formed followers by letting them walk with Him, learn from Him, fall near Him, and be sent by Him."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Which part of Jesus\' mentorship model is most often missing in modern leadership development — presence, example, correction, mission, or restoration?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Small Group Leadership (40-50 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Acts 2:42-47</strong><br>"And they devoted themselves to the apostles\' teaching and the fellowship, to the breaking of bread and the prayers."' },
            { type: 'text', content: 'Participants should understand how small groups can function as practical environments for discipleship, community care, accountability, and leadership development.' },
            { type: 'header_h3', content: 'A. Small Groups Create Relational Space for Discipleship' },
            { type: 'text', content: 'Large gatherings are essential, but they cannot carry every part of discipleship on their own. Smaller settings allow people to be known, encouraged, corrected, and supported more personally.' },
            { type: 'quote', content: '"day by day, attending the temple together and breaking bread in their homes..." — Acts 2:46<br>"I did not shrink from declaring to you anything that was profitable, and teaching you in public and from house to house" — Acts 20:20' },
            { type: 'header_h3', content: 'B. Healthy Small Groups Need Clear Purpose' },
            { type: 'text', content: 'A small group is not healthy simply because people meet. It should help participants grow in:<br>• Scripture<br>• Prayer<br>• Fellowship<br>• Care<br>• Obedience<br>• Mission' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Without clear purpose, groups often drift into social familiarity without spiritual depth.' },
            { type: 'header_h3', content: 'C. Small Group Leaders Are Shepherds at a Meaningful Level' },
            { type: 'text', content: 'They may not hold the office of pastor, but they often serve pastoral functions in miniature: noticing needs, facilitating care, encouraging growth, and helping maintain spiritual health.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'This is why small group leaders should be trained, not merely appointed because they are available.' },
            { type: 'header_h3', content: 'D. Good Small Group Leadership Requires Both Warmth and Guidance' },
            { type: 'text', content: 'A leader should help discussion remain biblical, participatory, honest, and practical without becoming controlling or passive. Helpful small group leadership often includes:<br>1. Preparing well<br>2. Welcoming people intentionally<br>3. Guiding discussion toward Scripture and application<br>4. Drawing quiet people to speak<br>5. Limiting dominating voices graciously<br>6. Protecting trust and healthy boundaries<br>7. Recognizing needs that require follow-up<br>8. Encouraging prayer and practical care' },
            { type: 'header_h3', content: 'E. Small Groups Are Valuable Places for Identifying Future Leaders' },
            { type: 'text', content: 'Consistent group settings often reveal who is faithful, teachable, caring, steady, and able to influence others well.' },
            { type: 'quote', content: '"what you have heard from me... entrust to faithful men." — 2 Timothy 2:2' },
            { type: 'header_h3', content: 'F. Small Groups Must Stay Connected to the Wider Church' },
            { type: 'text', content: 'Groups should not become isolated mini-churches centered on a personality. They should remain aligned with sound doctrine, accountable leadership, and the church\'s larger mission.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'This is an important safeguard against drift, imbalance, or informal authority becoming unhealthy.' },
            { type: 'header_h3', content: 'G. Small Groups Should Aim Toward Multiplication When Healthy' },
            { type: 'text', content: 'Not every group multiplies quickly, but healthy discipleship environments should eventually raise new leaders and create space for others to be gathered.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Small groups are not merely a scheduling strategy. They are one of the clearest places where people can be known, formed, and prepared to care for others."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What causes small groups to lose their discipling power — weak leadership, unclear purpose, lack of accountability, shallow discussion, or failure to multiply?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Diagnostics and System Evaluation (50-57 Minutes)' },
            { type: 'text', content: 'Participants should examine whether their current ministry actually has a workable discipleship system or merely a collection of activities. Ask participants to reflect silently or journal on these questions:<br><br>1. <strong>Reproduction:</strong> Am I intentionally developing people who can lead and disciple others?<br>2. <strong>Mentorship:</strong> Do I spend relational time with people, or only deliver information to them?<br>3. <strong>Small Groups:</strong> Are the groups in my ministry genuinely forming people, or simply gathering them?<br>4. <strong>Clarity:</strong> Could a new believer clearly see the pathway for growth in our church?<br>5. <strong>Patience:</strong> Am I willing to form people slowly, or do I mainly want quick results?<br>6. <strong>Depth:</strong> Does my model of discipleship address character, emotional health, obedience, and mission?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Discipleship is central to the mission of the church, not a side ministry\n- Healthy discipleship must be intentional, biblical, and reproducible\n- Reproducing leaders is a necessary outcome of mature discipleship\n- Jesus modeled discipleship through presence, teaching, example, and correction, and mission\n- Small groups can become powerful environments for formation, care, and leadership development\n- Churches must distinguish activity from actual spiritual growth\n- A strong discipleship system helps move people from belief to maturity to multiplication' },
            { type: 'quote', content: '"Closing Prayer:<br>Lord Jesus, make us faithful disciple-makers. Teach us to form people patiently, truthfully, and relationally. Save us from shallow ministry that gathers crowds without producing maturity. Help us invest in others the way you invested in those you called to yourself, and grant that the people we serve would grow into faithful followers who strengthen others also. In your name we pray. Amen."' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> 2 Timothy 2; Matthew 28:18-20; Acts 2:42-47<br>2. <strong>Journal:</strong> Where is discipleship in my ministry strongest, and where is it weakest?<br>3. <strong>Practice:</strong> Intentionally identify one person you should invest in over the next month.<br>4. <strong>Ministry Audit:</strong> Map the current discipleship pathway in your church and identify one major gap.<br>5. <strong>Memory Verse:</strong> 2 Timothy 2:2' },
            { type: 'multiple_choice', question: 'In Paul\'s discipleship model (2 Timothy 2:2), how many generations of disciples are described?', options: ['One — Paul to Timothy', 'Two — Paul and Timothy together', 'Three — Paul, Timothy, faithful men', 'Four — Paul, Timothy, faithful men, others also'], correct_index: 3, explanation: '2 Timothy 2:2 contains four generations: Paul → Timothy → faithful men → others also. This is the biblical DNA of multiplication — exponential Kingdom growth.' },
            { type: 'flip_card', icon: '🌱', front: 'What is the difference between addition and multiplication in discipleship?', back: 'Addition: one leader personally reaches one person at a time. Multiplication: each disciple makes disciples who make disciples. A church of multiplication eventually fills the earth (2 Timothy 2:2).' },
            { type: 'question', content: 'Reflect on your current approach to discipleship and leadership development. Write a detailed response (minimum 20 characters) answering: What is one specific change you will make in your discipleship practice, and who is one person you are committed to intentionally developing as a leader?' }
        ]
    },
    module8: {
        title: "Evangelism Leadership",
        subtitle: "Theology and foundation of evangelism, creating evangelistic culture, leading outreach ministries, community engagement, and personal diagnostics.",
        components: [
            { type: 'header_h1', content: 'Week 8: Evangelism Leadership' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand evangelism as a central leadership responsibility rather than a specialized ministry.<br>2. Recognize how leaders help shape an evangelistic culture within the church.<br>3. Develop practical wisdom for organizing and leading outreach ministries faithfully and fruitfully.<br>4. Discern the relationship between community engagement and gospel witness without replacing it.<br>5. Evaluate whether their current ministry environment actually encourages members to share the gospel.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction' },
            { type: 'text', content: 'This lesson moves from discipleship systems into the outward mission of the church through evangelism leadership. If discipleship helps form believers into maturity, evangelism leadership helps mobilize the church toward gospel witness in the world. Churches are not only called to care for those inside the flock, but to also bear witness to Christ among those who do not yet know Him.' },
            { type: 'quote', content: '"Go therefore and make disciples of all nations..."<br>— Matthew 28:18-20' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: 'Evangelism is not merely a program, an annual event, or the burden of a few unusually bold personalities. It is a core dimension of the church\'s life if leaders shape it. Leaders shape whether a congregation becomes faithful, passive, and inward-looking, or prayerful, confident, and outward-facing.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Theology and Foundation of Evangelism Leadership (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Matthew 28:18-20</strong><br>"Go therefore and make disciples of all nations..."' },
            { type: 'header_h3', content: 'A. Evangelism Begins With the Mission of Christ' },
            { type: 'text', content: 'The church does not invent its own mission. It receives its mission from the risen Christ.' },
            { type: 'quote', content: '"All authority in heaven and on earth has been given to me." — Matthew 28:18<br>"As the Father has sent me, even so I am sending you." — John 20:21' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Evangelism leadership must begin with Christ\'s authority, not with church anxiety about numbers or public relevance.' },
            { type: 'header_h3', content: 'B. Evangelism is Part of Disciple-Making' },
            { type: 'text', content: 'The Great Commission does not separate conversion from discipleship. The call is not merely to get responses, but to make disciples.' },
            { type: 'quote', content: '"make disciples of all nations" — Matthew 28:19<br>"teaching them to observe all that I have commanded you" — Matthew 28:20' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: This guards against shallow outreach methods that aim only at immediate decisions without long-term formation.' },
            { type: 'header_h3', content: 'C. The Gospel is the Message We Proclaim' },
            { type: 'text', content: 'Those things are not merely kindness, service, moral influence, or church visibility. Those things may support witness, but evangelism requires the communication of the good news of Jesus Christ.' },
            { type: 'quote', content: '"For I am not ashamed of the gospel, for it is the power of God for salvation..." — Romans 1:16' },
            { type: 'header_h3', content: 'D. The Holy Spirit Empowers Witness' },
            { type: 'text', content: 'Evangelism leadership should avoid both passivity and self-reliance. The church must act, but it acts dependently.' },
            { type: 'quote', content: '"you will receive power when the Holy Spirit has come upon you, and you will be my witnesses" — Acts 1:8' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Prayer is not preparation for evangelism only. Prayer is part of evangelism leadership itself.' },
            { type: 'header_h3', content: 'E. Leaders Shape the Witness of the Church' },
            { type: 'text', content: 'Pastors and ministry leaders influence whether evangelism is treated as urgent, normal, neglected, or awkward.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: If leaders speak often about internal church life but rarely about the lost, the church will become inward-facing. If leaders model compassion, courage, prayer, witness, those priorities begin to spread.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "An evangelistic church is rarely built by announcements alone. It is built when leaders keep the gospel mission visible in prayer, teaching, planning, and personal example."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do churches often affirm evangelism doctrinally while neglecting it practically?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Creating Evangelistic Culture (18-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Acts 4:29-31</strong><br>"...grant to your servants to continue to speak your word with all boldness..."' },
            { type: 'text', content: 'Participants should understand how leaders cultivate an environment where evangelism becomes a shared expectation rather than an occasional event.' },
            { type: 'header_h3', content: 'A. Culture is Formed by Repeated Emphasis' },
            { type: 'text', content: 'What leaders pray about, celebrate, report, teach, and prioritize becomes normal in church life.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: If evangelism appears only during an annual campaign, people will assume it is secondary. If it is regularly integrated into worship, prayer, testimony, planning, and discipleship, it becomes part of the church\'s identity.' },
            { type: 'header_h3', content: 'B. Evangelistic Culture Begins With Prayer' },
            { type: 'text', content: 'The early church asked for boldness and God\'s active power in witness.' },
            { type: 'quote', content: '"grant to your servants to continue to speak your word with all boldness" — Acts 4:29<br>"Continue steadfastly in prayer... that God may open to us a door for the word" — Colossians 4:2-3' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Leaders should normalize prayers for unbelieving friends, gospel opportunities, open hearts, and laborers for the harvest.' },
            { type: 'header_h3', content: 'C. Leaders Must Model Personal Concern for the Lost' },
            { type: 'text', content: 'People notice whether leaders actually speak with non-believers, invite others, welcome seekers, and talk naturally about gospel opportunities.' },
            { type: 'quote', content: '"Follow me, and I will make you fishers of men." — Matthew 4:19' },
            { type: 'header_h3', content: 'D. Testimony Strengthens Culture' },
            { type: 'text', content: 'When churches regularly hear stories of evangelistic conversations, answered prayer, conversions, invitations, and outreach efforts, faith grows.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Not every story needs to end in immediate conversion. Even stories of faithful witness can encourage the congregation.' },
            { type: 'header_h3', content: 'E. Training Removes Some Fear and Confusion' },
            { type: 'text', content: 'Believers are often silent not only because of fear, but because they do not know how to start, explain, or respond. Leaders should provide practical help including:<br>1. How to explain the gospel clearly<br>2. How to share a personal testimony briefly<br>3. How to ask good spiritual questions<br>4. How to answer common objections with gentleness<br>5. How to invite people to church or Bible study naturally<br>6. How to continue conversations over time' },
            { type: 'header_h3', content: 'F. Hospitality and Welcome Matter' },
            { type: 'text', content: 'An evangelistic culture pays attention to how newcomers, seekers, neighbors, and visitors are received. A church may preach outreach and still feel closed in practice.' },
            { type: 'header_h3', content: 'G. Celebrate Faithfulness, Not Only Visible Results' },
            { type: 'text', content: 'If leaders praise only dramatic outcomes, members may feel like ordinary witness does not count. But Scripture calls for faithfulness as well as expecting visible responses.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Evangelistic culture grows when the church learns to pray for the lost, speak of the lost, welcome the lost, and rejoice whenever the gospel is faithfully shared."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What most weakens evangelistic culture in churches — fear, busyness, lack of training, weak leadership, or unclear leadership?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Leading Outreach Ministries (30-40 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Luke 10:1-2</strong><br>"The harvest is plentiful, but the laborers are few."' },
            { type: 'text', content: 'Participants should gain practical wisdom for designing and leading outreach ministries that are biblical, organized, welcoming, and connected to the life of the church.' },
            { type: 'header_h3', content: 'A. Outreach Ministries Need Clear Gospel Purpose' },
            { type: 'text', content: 'An outreach ministry should not exist merely to create activity or visibility. It should help the church build real bridges for gospel witness.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Some ministries are busy but spiritually unclear. Leaders must keep asking, "How does this help us move toward meaningful gospel contact and disciple-making?"' },
            { type: 'header_h3', content: 'B. Outreach Must Be Prayerful and Intentional' },
            { type: 'text', content: 'Good outreach usually includes:<br>1. Prayer before action<br>2. A clear target or context<br>3. Prepared workers<br>4. A simple plan<br>5. Gospel clarity<br>6. Follow-up for interested people<br>7. Connection into church life or discipleship' },
            { type: 'header_h3', content: 'C. Different Contexts Require Different Outreach Approaches' },
            { type: 'text', content: 'A church may serve through:<br>• neighborhood visitation<br>• campus outreach<br>• mercy ministries<br>• family events<br>• public preaching<br>• literature distribution<br>• home Bible studies<br>• sports or youth-based outreach<br>• digital communication and invitation' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Methods can vary, but the gospel message must remain clear.' },
            { type: 'header_h3', content: 'D. Leaders Should Train Teams, Not Merely Recruit Volunteers' },
            { type: 'text', content: 'An outreach ministry becomes stronger when workers know the purpose, understand the message, and feel spiritually prepared.' },
            { type: 'header_h3', content: 'E. Follow-Up is a Major Leadership Responsibility' },
            { type: 'text', content: 'Many churches begin conversations but fail to take a next step. Outreach is weakened when no one is responsible to reconnect, answer questions, invite further conversation, or connect people to ongoing community.' },
            { type: 'header_h3', content: 'F. Outreach Ministries Must Avoid Unhealthy Patterns' },
            { type: 'text', content: 'Leaders should guard against:<br>• pressure tactics<br>• emotional manipulation<br>• unclear gospel presentations<br>• measuring success only by visible responses<br>• disconnected events with no follow-up<br>• methods that create attention but not trust' },
            { type: 'header_h3', content: 'G. Outreach Leadership Must Remain Pastorally Grounded' },
            { type: 'text', content: 'Evangelism teams need encouragement, correction, and shepherding. Outreach zeal without pastoral wisdom can become harsh, prideful, or unstable.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "A healthy outreach ministry does not merely send people out. It prepares them, supports them, and helps them follow through."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do outreach ministries often lose momentum after early enthusiasm?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Community Engagement (40-50 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Matthew 5:13-16</strong><br>"Let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven."' },
            { type: 'text', content: 'Participants should understand how to lead churches in meaningful community engagement that expresses Christian love and public witness without replacing evangelism with social activity alone.' },
            { type: 'header_h3', content: 'A. Community Engagement Can Create Credible Pathways for Witness' },
            { type: 'text', content: 'When churches serve people sincerely, listen well, and become known as a source of mercy, integrity, and care, they often gain relational access that supports gospel conversations.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Compassion is not the whole of evangelism, but it can strengthen the credibility of Christian witness.' },
            { type: 'header_h3', content: 'B. Community Engagement Should Reflect the Character of Christ' },
            { type: 'text', content: 'Jesus cared deeply, welcomed the overlooked, and moved toward broken people. Churches cannot engage communities merely for publicity, but from genuine love.' },
            { type: 'quote', content: '"He had compassion for them because they were harassed and helpless, like sheep without a shepherd." — Matthew 9:36' },
            { type: 'header_h3', content: 'C. Engagement Requires Listening to Real Needs' },
            { type: 'text', content: 'Leaders should seek to understand the actual burdens, questions, and patterns in their surrounding community rather than assuming needs from a distance. Possible areas of engagement may include:<br>• family support<br>• food assistance<br>• counseling referral<br>• refugee or migrant support<br>• youth mentoring<br>• literacy help<br>• community prayer presence<br>• practical service projects' },
            { type: 'header_h3', content: 'D. Community Engagement is Not the Same as Gospel Proclamation' },
            { type: 'text', content: 'A church may serve generously and still fail to speak of Christ clearly. Service should not replace witness.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: This is one of the most important balancing points in the lesson. Good works adorn the gospel, but they do not themselves explain the death and resurrection of Christ.' },
            { type: 'header_h3', content: 'E. Wise Engagement Requires Boundaries and Discernment' },
            { type: 'text', content: 'Not every opportunity is sustainable, and not every social need can be carried by one church alone. Leaders must avoid overextension, mission drift, and mercy efforts detached from spiritual purpose.' },
            { type: 'header_h3', content: 'F. Community Trust Grows Through Consistency' },
            { type: 'text', content: 'Communities often respond more deeply to faithful long-term presence than to occasional high-energy events.' },
            { type: 'header_h3', content: 'G. Community Engagement Can Help Identify Future Ministry Bridges' },
            { type: 'text', content: 'As a church becomes known, opportunities often open for Bible conversations, family support, neighborhood prayer, small groups, and relational evangelism.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Community engagement opens doors best when people can see both the compassion of Christ in our actions and the message of Christ in our words."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> How can a church serve its community sincerely without allowing service to replace clear gospel witness?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal and Ministry Diagnostics (50-57 Minutes)' },
            { type: 'text', content: 'Participants should evaluate whether their ministry actually fosters evangelistic health or simply assumes it. Ask participants to reflect silently or journal on these questions:<br><br>1. <strong>Culture:</strong> Does my leadership make evangelism visible and normal?<br>2. <strong>Modeling:</strong> Do I personally display concern for those outside the church?<br>3. <strong>Training:</strong> Am I equipping people to share the gospel clearly and naturally?<br>4. <strong>Outreach:</strong> Are our outreach ministries purposeful, prayerful, and connected to follow-up?<br>5. <strong>Community:</strong> Does community engagement strengthen or is it meant to replace gospel proclamation?<br>6. <strong>Courage:</strong> What fears or hesitations most weaken my evangelistic leadership?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Evangelism is a central part of church leadership, not a side ministry\n- Leaders help create either an evangelistic culture or an inward-looking one\n- Prayer, modeling, testimony, and training are essential in building evangelistic culture\n- Outreach ministries need gospel clarity, preparation, and follow-up\n- Community engagement can strengthen witness but it must not replace proclamation\n- The church must connect evangelism to disciple-making\n- Faithful evangelism leadership combines boldness, love, wisdom, and dependence on the Holy Spirit' },
            { type: 'quote', content: '"Closing Prayer:<br>Lord, give us faithful witnesses and wise leaders of your people. Give us courage without harshness, compassion without compromise, and zeal without self-reliance. Teach us to build churches that pray for the lost, speak the gospel clearly, serve the community sincerely, and welcome people into the life of discipleship. In Jesus\' name. Amen."' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> Matthew 28:18-20; Acts 1:8; Colossians 4:2-6<br>2. <strong>Journal:</strong> What most weakens evangelistic culture in my ministry right now?<br>3. <strong>Practice:</strong> Have one intentional gospel conversation or invite one person into a meaningful spiritual conversation this week.<br>4. <strong>Ministry Audit:</strong> Evaluate one current outreach effort and identify whether it has prayer, gospel clarity, and follow-up.<br>5. <strong>Memory Verse:</strong> Acts 1:8' },
            { type: 'true_false', statement: 'Evangelism is primarily the responsibility of specially gifted individuals called evangelists, not the whole church body.', correct: false, explanation: 'Ephesians 4:11-12 shows that evangelists equip ALL the saints for the work of ministry. Acts 8:1-4 records that ordinary scattered believers "went about preaching the word." The whole church is a witnessing community.' },
            { type: 'matching', pairs: [{ left: 'Go and make disciples', right: 'Matthew 28:19 — The Great Commission' }, { left: 'You will be my witnesses', right: 'Acts 1:8 — Jerusalem, Judea, Samaria, ends of the earth' }, { left: 'As the Father has sent me', right: 'John 20:21 — Incarnational sending model' }, { left: 'Preach the gospel to all creation', right: 'Mark 16:15 — Universal scope of the mission' }] },
            { type: 'question', content: 'Reflect honestly on the evangelistic health of your ministry. Write a detailed response (minimum 20 characters) answering: What specific step will you take this week to strengthen evangelistic culture in your church or ministry context, and what personal fear or hesitation do you need to overcome?' }
        ]
    },
    module9: {
        title: "Biblical Leadership Models",
        subtitle: "Servant leadership, leading by influence, humility and authority, distortions in leadership, and personal diagnostics.",
        components: [
            { type: 'header_h1', content: 'Week 9: Biblical Leadership Models' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand the basic biblical models of leadership and how they differ from worldly patterns of power.<br>2. Recognize servant leadership as central to Christlike ministry.<br>3. Develop a working understanding of how influence functions in spiritual leadership.<br>4. Discern the relationship between humility and authority in spiritual leadership.<br>5. Evaluate whether their own leadership style reflects Scripture, credibility, and godly strength.<br>6. Identify common distortions of leadership, including pride, domination, passivity, insecurity, and image-driven influence.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction' },
            { type: 'text', content: 'This lesson moves from evangelism leadership into the deeper question of what kind of leader a Christian leader is meant to be. Ministry leadership is not defined only by tasks, structure, doctrine, or public effectiveness. It is also shaped by the model of leadership a person embodies. Scripture does not merely tell leaders what to do; it shows them how to lead.' },
            { type: 'quote', content: '"You know that those who are considered rulers of the Gentiles lord it over them... But it shall not be so among you. But whoever would be great among you must be your servant."<br>— Mark 10:42-45' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: 'The central concern of this lesson is that many leadership instincts are formed more by culture, personality, ambition, or reaction than by Christ. Many leaders confuse authority with control. Others reject authority in the name of humility. Some seek influence through charisma, visibility, or force of personality. Others shrink back from decisive leadership because they fear domination and toxicity. The primary text, Mark 10:42-45, is especially important because Jesus directly contrasts worldly leadership with Kingdom leadership.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Servant Leadership (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Mark 10:42-45</strong><br>"You know that those who are considered rulers of the Gentiles lord it over them... But it shall not be so among you. But whoever would be great among you must be your servant."' },
            { type: 'header_h3', content: 'A. Jesus Contrasts Worldly Power With Kingdom Leadership' },
            { type: 'text', content: 'Jesus explicitly identifies a pagan pattern of leadership: dominance, status, and the exercising of power over others. Then He rejects that model for His followers.' },
            { type: 'quote', content: '"those who are considered rulers of the Gentiles lord it over them" — Mark 10:42<br>"But it shall not be so among you" — Mark 10:43' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'This is one of the strongest leadership reversals in the New Testament. Jesus does not merely warn against abuse. He redefines greatness itself.' },
            { type: 'header_h3', content: 'B. Greatness in Christ\'s Kingdom is Expressed Through Service' },
            { type: 'text', content: 'Service is not beneath leadership. In the kingdom of God, service is one of the deepest proofs of leadership authority.' },
            { type: 'quote', content: '"whoever would be great among you must be your servant" — Mark 10:43<br>"whoever would be first among you must be slave of all" — Mark 10:44' },
            { type: 'header_h3', content: 'C. Jesus is the Model of Servant Leadership' },
            { type: 'text', content: 'Christ does not command what He refuses to embody. He leads by self-giving.' },
            { type: 'quote', content: '"For even the Son of Man came not to be served, but to serve, and to give his life as a ransom for many." — Mark 10:45<br>"If I then, your Lord and Teacher, have washed your feet, you also ought to wash one another\'s feet." — John 13:14' },
            { type: 'header_h3', content: 'D. Servant Leadership Does Not Cancel Authority' },
            { type: 'text', content: 'Some misunderstand servant leadership as the removal of leadership distinctions, direction, or decision-making. But Jesus, who served perfectly, also commanded, corrected, sent, and ruled with authority.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Servant leadership and authority are not enemies. The question is whether authority is exercised for self-exaltation or faithful stewardship.' },
            { type: 'header_h3', content: 'E. Servant Leadership Requires Sacrifice' },
            { type: 'text', content: 'A servant leader gives time, attention, energy, comfort, and often reputation for the sake of others.' },
            { type: 'quote', content: '"through love serve one another" — Galatians 5:13<br>"we do not preach ourselves, but Jesus Christ as Lord, with ourselves as your servants for Jesus\' sake" — 2 Corinthians 4:5' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Servant leadership means the leader does not ask, \'How can these people advance me?\' but \'How can I faithfully serve their good under Christ?\'"' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do people often admire servant leadership in theory but resist it in practice?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Leading by Influence (18-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Corinthians 11:1</strong><br>"Be imitators of me, as I am of Christ."' },
            { type: 'text', content: 'Participants should understand that biblical leadership often works through influence, example, credibility, and trust, not merely through title or positional power.' },
            { type: 'header_h3', content: 'A. Spiritual Leadership Includes Moral and Relational Influence' },
            { type: 'text', content: 'A leader shapes others not only by commands given, but by the life being observed.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Influence in biblical leadership is not manipulation, branding, or personality projection. It is the capacity to help others move toward faithfulness through example, truth, and trustworthy presence.' },
            { type: 'header_h3', content: 'B. Example Strengthens Authority' },
            { type: 'text', content: 'People are more likely to follow leadership that is credible. Paul repeatedly called believers to observe and imitate godly patterns.' },
            { type: 'quote', content: '"Be imitators of me, as I am of Christ." — 1 Corinthians 11:3<br>"Remember your leaders, those who spoke to you the word of God. Consider the outcome of their way of life, and imitate their faith." — Hebrews 13:7' },
            { type: 'header_h3', content: 'C. Influence is Often Stronger Than Position' },
            { type: 'text', content: 'A leader may hold office and still have little meaningful influence if trust, integrity, and spiritual weight are lacking. On the other hand, a faithful person may exert deep influence even before holding major responsibility.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: This is why character cannot be treated as secondary to giftedness.' },
            { type: 'header_h3', content: 'D. Influence Grows Through Consistency' },
            { type: 'text', content: 'Leaders gain influence when people repeatedly see:<br>• integrity<br>• wisdom<br>• courage<br>• tendemess<br>• self-control<br>• sound speech<br>• reliability<br>• spiritual depth' },
            { type: 'header_h3', content: 'E. Influence Should Point People to Christ, Not to the Leader\'s Image' },
            { type: 'text', content: 'A leader fails when personal influence becomes a form of self-centered dependence.' },
            { type: 'quote', content: '"What then is Apollos? What is Paul? Servants through whom you believed..." — 1 Corinthians 3:5' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Biblical influence helps people stand more firmly in Christ, not more emotionally attached to a human personality.' },
            { type: 'header_h3', content: 'F. Influence Often Precedes Multiplication' },
            { type: 'text', content: 'People who are influenced deeply are more likely to receive correction, embrace formation, and eventually reproduce what they have seen.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Titles may open a door to leadership, but influence is what often determines what a leader will truly receive when it arrives."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What gives a leader real influence in ministry — gifting, office, results, personality, credibility, or holiness?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Humility and Authority (30-40 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Peter 5:2-3, 5</strong><br>"Shepherd the flock of God... not domineering over those in your charge, but being examples to the flock. Clothe yourselves, all of you, with humility toward one another."' },
            { type: 'text', content: 'Participants should see that humility and authority belong together in biblical leadership, and that one of the greatest errors in ministry is separating what Scripture keeps united.' },
            { type: 'header_h3', content: 'A. Humility is Not Weakness' },
            { type: 'text', content: 'Biblical humility is not insecurity, self-erasure, indecision, or fear of responsibility. It is a truthful, God-centered posture that refuses self-exaltation.' },
            { type: 'quote', content: '"with humility toward one another" — 1 Peter 5:5<br>"Do nothing from selfish ambition or conceit, but in humility count others more significant than yourselves." — Philippians 2:3' },
            { type: 'header_h3', content: 'B. Authority is a Real Biblical Category' },
            { type: 'text', content: 'Scripture does not apologize for leadership authority, oversight, shepherding, teaching, and accountability. God entrusts real responsibility to leaders.' },
            { type: 'quote', content: '"Obey your leaders and submit to them, for they are keeping watch over your souls" — Hebrews 13:17<br>"Shepherd the flock of God that is among you, exercising oversight" — 1 Peter 5:2' },
            { type: 'header_h3', content: 'C. Humility Governs How Authority is Exercised' },
            { type: 'text', content: 'A humble leader does not use authority to dominate, protect ego, win admiration, or silence difficulty. Humility makes authority safer and more faithful.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Without humility, authority tends toward harshness. Without authority, humility can be misused as an excuse for passivity.' },
            { type: 'header_h3', content: 'D. Jesus Held Complete Authority With Perfect Humility' },
            { type: 'text', content: 'Christ is the supreme model here. He possessed all authority, yet He humbled Himself in obedience and service.' },
            { type: 'quote', content: '"All authority in heaven and on earth has been given to me." — Matthew 28:18<br>"he humbled himself by becoming obedient to the point of death" — Philippians 2:8' },
            { type: 'header_h3', content: 'E. Humble Authority Listens, Learns, and Corrects Wisely' },
            { type: 'text', content: 'A humble leader is teachable, approachable, and self-aware. Yet humility does not prevent firmness where truth, holiness, or protection are required.' },
            { type: 'header_h3', content: 'F. False Humility Can Damage Leadership' },
            { type: 'text', content: 'Some leaders avoid hard decisions, necessary correction, or clear direction because they do not want to appear strong. But refusal to lead can be just as harmful as prideful control.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Humility does not mean a leader has no authority. It means he uses authority as a steward, not as an owner."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do people so often separate humility from authority, as if one must weaken the other?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Distortions and Dangers in Leadership Models (40-50 Minutes)' },
            { type: 'text', content: 'Participants should identify common false patterns that corrupt biblical leadership. Common Distortions:' },
            { type: 'header_h3', content: 'A. Domineering Leadership' },
            { type: 'text', content: 'This leader uses power, fear, control, and status to get compliance.' },
            { type: 'quote', content: '"not domineering over those in your charge" — 1 Peter 5:3' },
            { type: 'header_h3', content: 'B. Passive Leadership' },
            { type: 'text', content: 'This leader avoids hard decisions, difficult conversations, and necessary responsibility under the language of peace or humility.' },
            { type: 'header_h3', content: 'C. Image-Driven Leadership' },
            { type: 'text', content: 'This leader is preoccupied with reputation, visibility, platform, and appearance of success.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Influence becomes dangerous when it is pursued as a personal brand rather than received as a stewardship.' },
            { type: 'header_h3', content: 'D. Insecure Leadership' },
            { type: 'text', content: 'This leader becomes threatened by gifted people, resists delegation, and clings to control.' },
            { type: 'header_h3', content: 'E. Charisma Without Character' },
            { type: 'text', content: 'The leader can gather attention but lacks the depth, stability, and holiness needed for trustworthy influence.' },
            { type: 'header_h3', content: 'F. Service Language Covering Control' },
            { type: 'text', content: 'Some leaders speak often about serving while quietly maintaining unholy control over people, access, decisions, or loyalty.' },
            { type: 'header_h3', content: 'G. Authority Without Tenderness' },
            { type: 'text', content: 'Leaders who always emphasize command, correction, and structure may wound people even when parts of their doctrine are right.' },
            { type: 'header_h3', content: 'H. Humility Without Courage' },
            { type: 'text', content: 'Leaders who speak softly but never act firmly may leave people unprotected and ministry directionless.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Every distorted leadership model takes something good — authority, service, influence, humility, strength — and bends it away from Christ."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Which leadership distortion is most likely to be tolerated in ministry settings because it looks successful on the surface?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Diagnostics and Leadership Reflection (50-57 Minutes)' },
            { type: 'text', content: 'Participants should examine their own leadership patterns honestly in light of Scripture. Ask participants to reflect silently or journal on these questions:<br><br>1. <strong>Service:</strong> Do I lead mainly to serve others, or do I quietly expect leadership to carry me?<br>2. <strong>Influence:</strong> Is my influence rooted in character and example, or mainly in role, gifting, and recognition?<br>3. <strong>Humility:</strong> Am I teachable, approachable, and honest about my weaknesses?<br>4. <strong>Authority:</strong> Do I use authority clearly and faithfully, or do I become controlling or avoidant?<br>5. <strong>Pressure:</strong> What happens to my leadership when I feel threatened, tired, or criticized?<br>6. <strong>Motive:</strong> Do I want to be faithful, or do I want to appear impressive?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Biblical leadership is modeled by Christ, not by worldly power structures\n- Servant leadership is central to Christian greatness\n- Real influence grows from character, credibility, and example\n- Humility and authority belong together in faithful leadership\n- Leadership distortions often appear strong while being spiritually unhealthy\n- God-centered leaders examine, not just do, but how they lead\n- Christlike leadership uses strength for the good of others and the glory of God' },
            { type: 'quote', content: '"Closing Prayer:<br>Lord Jesus, teach us to lead the way you lead. Save us from pride, fear that dominates, and self-reliance that suffocates. Form in us the servant heart of Jesus, humble strength, and faithful courage. Help us carry authority as steward under your lordship and use every gift for the good of your people and the honor of your name. Amen."' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> Mark 10:35-45; John 13:1-17; Philippians 2:1-11<br>2. <strong>Journal:</strong> Which distortion am I most vulnerable to as a leader, and why?<br>3. <strong>Practice:</strong> Identify one concrete way to serve someone under your leadership this week without expecting recognition.<br>4. <strong>Ministry Audit:</strong> Ask one trusted person how your leadership feels in practice — supportive, controlling, unclear, or steady, approachable.<br>5. <strong>Memory Verse:</strong> Mark 10:44-45' },
            { type: 'flip_card', icon: '👑', front: 'What does servant leadership actually look like in practice?', back: 'It looks like Jesus washing feet (John 13) — the one with the most authority taking the lowest position. It means leading by example, absorbing cost rather than passing it on, and measuring success by the growth of others, not personal power.' },
            { type: 'accordion', items: [{ title: 'Distortion 1 — Domineering Leadership (1 Peter 5:3)', content: '"Not domineering over those in your charge, but being examples to the flock." Domineering leaders coerce compliance through fear and suppress questioning. The antidote is transparent, accountable leadership.' }, { title: 'Distortion 2 — Celebrity Leadership', content: 'When the leader becomes the brand, the church becomes dependent on a personality rather than on Christ. Faithful leaders consistently redirect attention to Christ.' }, { title: 'Distortion 3 — Passive Leadership', content: 'Some leaders confuse humility with absence of direction. Servant leadership requires decisive courage — speaking truth, making hard calls, and steering the church toward faithfulness even when unpopular.' }] },
            { type: 'question', content: 'Reflect honestly on your own leadership model. Write a detailed response (minimum 20 characters) answering: What leadership distortion are you most susceptible to, and what specific step will you take this week to lead more like Christ — with both servant humility and faithful authority?' }
        ]
    },
    module10: {
        title: "Decision Making in Ministry",
        subtitle: "Biblical wisdom, discernment, leadership accountability, common dangers, and practical patterns for faithful ministry decisions.",
        components: [
            { type: 'header_h1', content: 'Week 10: Decision Making in Ministry' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand that decision making in ministry must be shaped by biblical wisdom rather than management principles alone.<br>2. Recognize the importance of spiritual discernment in evaluating opportunities, people, timing, and priorities.<br>3. Develop a healthier understanding of leadership accountability in ministry decisions.<br>4. Identify practical biblical patterns for making wise decisions in both ordinary and difficult situations.<br>5. Discern common dangers in ministry decision making, including haste, pride, isolation, fear, and people-pleasing.<br>6. Evaluate whether their current decision-making habits reflect dependence on God, wise counsel, and faithful stewardship.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Introduction' },
            { type: 'text', content: 'This lesson moves from biblical leadership models into the daily reality of decision making in ministry. Every leader makes decisions constantly: what to prioritize, when to trust, when to act, when to wait, how to respond in conflict, how to allocate time, how to handle opportunities, and how to lead the church through uncertainty. Some decisions are public and weighty. Others seem small but shape the ministry over time. The aim is not to produce leaders who merely make efficient decisions, but to help them make wise, discerning, and accountable decisions under the lordship of Christ.' },
            { type: 'quote', content: '"If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him."<br>— James 1:5' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: 'The central themes of this lesson are biblical wisdom, discernment, and leadership accountability. Wisdom helps leaders see life truthfully and act fittingly. Discernment helps them distinguish between what appears right and what is truly best. Accountability helps leaders protect themselves from pride, blindness, impulsiveness, and self-deception.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Biblical Wisdom in Ministry Decisions (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: James 1:5</strong><br>"If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him."' },
            { type: 'text', content: 'Participants must understand that ministry decisions require biblical wisdom, not merely intelligence, experience, or efficiency.' },
            { type: 'header_h3', content: 'A. Wisdom is More Than Knowledge' },
            { type: 'text', content: 'Knowledge gathers information. Wisdom applies truth rightly. A leader may know many facts and still make poor decisions if he lacks spiritual judgment.' },
            { type: 'quote', content: '"If any of you lacks wisdom, let him ask God..." — James 1:5<br>"Be careful then how you walk, not as unwise but as wise" — Ephesians 5:15' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Wisdom is the God-given ability to see life truthfully and act fittingly. It involves judgment, timing, proportion, motive, and obedience.' },
            { type: 'header_h3', content: 'B. Wisdom Begins With Dependence on God' },
            { type: 'text', content: 'James teaches leaders to ask for wisdom. This means wise decision making begins with humility, not self-confidence.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Some leaders ask for divine guidance while already being committed to their own preferences. Real prayer for wisdom includes willingness to be corrected.' },
            { type: 'header_h3', content: 'C. Wisdom is Shaped by Scripture' },
            { type: 'text', content: 'Wisdom is not vague spiritual intuition. It is formed by God\'s revealed truth.' },
            { type: 'quote', content: '"Trust in the Lord with all your heart, and do not lean on your own understanding." — Proverbs 3:5<br>"Your word is a lamp to my feet and a light to my path" — Psalm 119:105' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Scripture may not answer every strategic question directly, but it forms the categories, priorities, and moral instincts by which leaders decide.' },
            { type: 'header_h3', content: 'D. Wisdom Considers Long-Term Fruit, Not Short-Term Relief' },
            { type: 'text', content: 'Foolish decisions often solve immediate discomfort while creating deeper problems later.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Leaders must learn to ask not only, "Will this work now?" but also, "What will this produce over time?"' },
            { type: 'header_h3', content: 'E. Wisdom Includes Timing' },
            { type: 'text', content: 'A good idea handled at the wrong time can still be unwise.' },
            { type: 'quote', content: '"For everything there is a season..." — Ecclesiastes 3:1<br>"The heart of man plans his way, but the Lord establishes his steps." — Proverbs 16:9' },
            { type: 'header_h3', content: 'F. Wisdom Includes Teachability' },
            { type: 'text', content: 'A leader who cannot receive correction will eventually make increasingly isolated decisions.' },
            { type: 'quote', content: '"Listen to advice and accept instruction, that you may gain wisdom in the future." — Proverbs 19:20' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Wisdom is not merely knowing what can be done. It is knowing what should be done, when it should be done, and why."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do capable leaders sometimes make unwise ministry decisions even when they know Scripture well?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Discernment (18-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Philippians 1:9-10</strong><br>"And it is my prayer that your love may abound more and more, with knowledge and all discernment, so that you may approve what is excellent..."' },
            { type: 'text', content: 'Participants should understand that discernment is essential for evaluating motives, opportunities, relationships, timing, and competing priorities in ministry.' },
            { type: 'header_h3', content: 'A. Discernment is the Ability to Distinguish Wisely' },
            { type: 'text', content: 'Some ministry choices are not between obvious good and evil, but between good, better, and best. Discernment helps leaders recognize what is fitting and most faithful.' },
            { type: 'quote', content: '"approve what is excellent" — Philippians 1:10<br>"be transformed by the renewal of your mind, that by testing you may discern what is the will of God" — Romans 12:2' },
            { type: 'header_h3', content: 'B. Discernment Asks Deeper Questions' },
            { type: 'text', content: 'Discernment moves beyond surface appearance. It asks:<br>• What is really happening here?<br>• What motives are at work?<br>• What are the likely consequences?<br>• Is this wise, or only attractive?<br>• Is this opportunity aligned with our calling?<br>• Does this decision strengthen or distract from the mission?' },
            { type: 'header_h3', content: 'C. Discernment is Especially Necessary in Ministry Opportunities' },
            { type: 'text', content: 'Not every open door is automatically God\'s best assignment. Leaders can be overwhelmed by good opportunities that gradually pull them away from their core calling.' },
            { type: 'quote', content: '"It is not right that we should give up preaching the word of God to serve tables." — Acts 6:2' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Acts 6 is not a rejection of service. It is a model of discernment in assigning responsibility according to calling and priority.' },
            { type: 'header_h3', content: 'D. Discernment Helps Leaders Read People Wisely' },
            { type: 'text', content: 'Leaders must discern whether a situation involves:<br>• misunderstanding<br>• immaturity<br>• resistance<br>• grief<br>• manipulation<br>• exhaustion<br>• genuine need' },
            { type: 'header_h3', content: 'E. Discernment Guards Against Deception and Appearances' },
            { type: 'text', content: 'A ministry option may appear successful while quietly weakening truth, unity, or spiritual openness.' },
            { type: 'header_h3', content: 'F. Discernment Grows Through Maturity' },
            { type: 'text', content: 'Discernment is sharpened by Scripture, prayer, experience, wise counsel, and self-awareness. It is usually formed over time, not downloaded instantly.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Discernment is the difference between reacting to what is visible and understanding what is actually happening."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> In ministry, what is usually harder — recognizing what is wrong, or discerning what is best among many good options?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Leadership Accountability (30-40 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Proverbs 15:22</strong><br>"Without counsel plans fail, but with many advisers they succeed."' },
            { type: 'text', content: 'Participants should see that wise ministry decisions require accountability, counsel, and transparency that is cultivated rather than isolated leadership.' },
            { type: 'header_h3', content: 'A. Accountability Protects Leaders From Blind Spots' },
            { type: 'text', content: 'No leader sees everything clearly. Even sincere leaders can misjudge motives, overestimate strength, or underestimate consequences.' },
            { type: 'quote', content: '"Without counsel plans fail..." — Proverbs 15:22' },
            { type: 'header_h3', content: 'B. Shared Wisdom is a Biblical Pattern' },
            { type: 'text', content: 'The New Testament repeatedly shows leadership exercised in community, not isolation. Acts 6 shows the apostles involving the wider body in a wise solution. Acts 15 shows leaders gathering, debating, examining evidence, and reaching judgment together.' },
            { type: 'header_h3', content: 'C. Accountability Includes Openness About Major Decisions' },
            { type: 'text', content: 'Leaders cannot cultivate secrecy, ambiguity, or unilateral control where transparency is appropriate.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Some matters require confidentiality, but wise leaders distinguish confidentiality from secrecy and stewardship from control.' },
            { type: 'header_h3', content: 'D. Accountability Requires the Right People' },
            { type: 'text', content: 'Not all voices should carry equal weight. Wise counsel should come from people marked by maturity, truthfulness, courage, and spiritual health.' },
            { type: 'header_h3', content: 'E. Accountability Includes Answerability for Outcomes' },
            { type: 'text', content: 'Leaders must be willing to explain decisions, evaluate fruit, admit mistakes, and receive correction.' },
            { type: 'header_h3', content: 'F. Accountability Strengthens Trust' },
            { type: 'text', content: 'People may not agree with every leadership decision, but they are more likely to trust leadership that is humble, careful, and visibly accountable.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Accountability does not weaken leadership. It keeps leadership honest, safer, and more trustworthy."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why are leaders often tempted to make important decisions in isolation?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Common Decision-Making Dangers and Practical Patterns (40-50 Minutes)' },
            { type: 'text', content: 'Participants should identify common dangers in ministry decision making and gain a practical framework for wiser leadership choices. Common Dangers:' },
            { type: 'header_h3', content: 'A. Haste' },
            { type: 'text', content: 'Some leaders act too quickly because pressure feels urgent.' },
            { type: 'quote', content: '"The plans of the diligent lead surely to abundance, but everyone who is hasty comes only to poverty." — Proverbs 21:5' },
            { type: 'header_h3', content: 'B. Fear of People' },
            { type: 'text', content: 'Leaders may choose what preserves approval rather than what is most faithful.' },
            { type: 'quote', content: '"The fear of man lays a snare, but whoever trusts in the Lord is safe." — Proverbs 29:25' },
            { type: 'header_h3', content: 'C. Pride' },
            { type: 'text', content: 'Pride resists counsel, overestimates judgment, and protects ego.' },
            { type: 'header_h3', content: 'D. Indecisiveness' },
            { type: 'text', content: 'Some leaders delay necessary action because they fear conflict, responsibility, or failure.' },
            { type: 'header_h3', content: 'E. Pragmatism Detached From Principle' },
            { type: 'text', content: 'A ministry option may seem efficient while undermining biblical integrity.' },
            { type: 'header_h3', content: 'F. Fatigue and Emotional Reactivity' },
            { type: 'text', content: 'Exhausted leaders often decide poorly, sharply, or defensively.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: 'Teacher Supplement: Peter Scazzero is especially relevant here. Emotional immaturity and exhaustion can distort discernment.' },
            { type: 'text', content: '<strong>A Practical Pattern for Ministry Decisions:</strong><br>Offer participants this simple framework:<br>1. Pray for wisdom<br>2. Clarify the real issue<br>3. Search the Scriptures for governing principles<br>4. Gather needed facts carefully<br>5. Seek wise counsel<br>6. Discern motives and likely consequences<br>7. Decide with faith and humility<br>8. Communicate clearly<br>9. Review the decision afterward<br>10. Remain teachable if correction is needed' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Illustration:</strong> "Wise decisions are rarely made by urgency alone. They are formed where prayer, truth, counsel, and courage meet."' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Which danger most commonly distorts ministry decisions — haste, fear, pride, isolation, or exhaustion? Why?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Diagnostics and Reflection (50-57 Minutes)' },
            { type: 'text', content: 'Participants should examine their own habits, pressures, and weaknesses in decision making. Ask participants to reflect silently or journal on these questions:<br><br>1. <strong>Wisdom:</strong> Do I seek God\'s wisdom first, or only after my instincts are already engaged?<br>2. <strong>Discernment:</strong> Do I look beneath the surface of opportunities, conflicts, and pressures?<br>3. <strong>Counsel:</strong> Do I seek wise counsel early, or only when things begin to go wrong?<br>4. <strong>Accountability:</strong> Who can question my decisions legitimately?<br>5. <strong>Pressure:</strong> What usually affects my decision making most — fear, fatigue, urgency, pride, or people-pleasing?<br>6. <strong>Faithfulness:</strong> Am I concerned with appearing wise or with being wise?' },
            { type: 'text', content: '<strong>Ministry Application Questions:</strong><br>• What recent ministry decision most reveals my present leadership habits?<br>• Where do I need stronger counsel or clearer accountability?<br>• Am I training others to make wise decisions, or only making them for those I lead?<br>• Does my decision-making pattern produce trust, clarity, and health in the people I lead?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Ministry decision making is a spiritual responsibility, not merely an administrative task\n- Biblical wisdom is essential for faithful leadership choices\n- Discernment helps leaders distinguish what is true, fitting, and best\n- Accountability protects leaders and strengthens trust\n- Wise counsel and transparency prevent lonely and costly ministry decisions\n- Wise decisions are shaped by prayer, Scripture, counsel, facts, and humility\n- Faithful leaders are not only decisive; they are teachable, discerning, and accountable' },
            { type: 'quote', content: '"Closing Prayer:<br>Lord, give us wisdom from above — pure, peaceable, gentle, open to reason, full of mercy and good fruits. Guard us from foolish haste, from pride that refuses counsel, and from fear that narrows our decisions. Lead us to lead with discernment, humility, and consecration so that our decisions may honor you and serve your people well. In Jesus\' name. Amen."' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> James 1; Acts 6; Acts 15<br>2. <strong>Journal:</strong> What recent ministry decision best reveals my strengths and weaknesses as a leader?<br>3. <strong>Practice:</strong> Before making one important decision this week, pause to pray, gather counsel, and write down the biblical principles involved.<br>4. <strong>Ministry Audit:</strong> Identify one area where decision-making accountability needs to be strengthened in your ministry.<br>5. <strong>Memory Verse:</strong> James 1:5' },
            { type: 'multiple_choice', question: 'According to Proverbs 15:22, what happens to plans made without counsel?', options: ['They succeed through faith alone', 'They fail for lack of wisdom', 'They are established by God anyway', 'Plans fail, but with many advisers they succeed'], correct_index: 3, explanation: 'Proverbs 15:22 — "Without counsel plans fail, but with many advisers they succeed." Isolated decision-making is a warning sign of pride.' },
            { type: 'matching', pairs: [{ left: 'Vision casting', right: 'Painting a compelling picture of God\'s preferred future' }, { left: 'Strategic planning', right: 'Identifying steps, resources, and timelines to reach goals' }, { left: 'Seeking counsel', right: 'Proverbs 15:22 — Safety in multiple advisors' }, { left: 'Evaluation', right: 'Honestly assessing what worked, what didn\'t, and why' }] },
            { type: 'question', content: 'Reflect honestly on how you currently make ministry decisions. Write a detailed response (minimum 20 characters) answering: What is the greatest danger in your decision-making process (haste, fear, pride, isolation, or fatigue), and what specific changes will you make to ensure your decisions are shaped by biblical wisdom, counsel, and prayer?' }
        ]
    },
    module11: {
        title: "Conflict Resolution",
        subtitle: "Biblical principles, reconciliation, protecting unity, common mistakes, and practical wisdom for addressing conflict in ministry settings.",
        components: [
            { type: 'header_h1', content: 'Week 11: Conflict Resolution' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand common causes of conflict in church and ministry settings.<br>2. Recognize biblical reconciliation as a central leadership responsibility.<br>3. Develop practical wisdom for responding to conflict truthfully, calmly, and redemptively.<br>4. Learn how to protect unity without avoiding hard conversations.<br>5. Discern the difference between peacemaking, peacekeeping, and unhealthy avoidance.<br>6. Evaluate whether their own leadership instincts help heal conflict or quietly deepen it.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Session Overview for the Teacher' },
            { type: 'text', content: 'This lesson moves from decision making in ministry into one of the most unavoidable realities of leadership: conflict resolution. Wherever people, convictions, personalities, preferences, pressures, expectations, and weaknesses come together, conflict will eventually appear. The issue is not whether conflict exists, but whether leaders know how to handle it in a biblical, courageous, and redemptive way.<br><br>Conflict in church life can arise from many sources: misunderstandings, pride, doctrinal disagreement, ministry preference, miscommunication, unmet expectations, jealousy, offense, leadership struggles, cultural differences, fatigue, and unresolved hurt. Some conflict is minor and can be covered in love. Some requires careful private confrontation. Some becomes serious enough to threaten relationships, witness, trust, or church health. Leaders must learn to distinguish these situations wisely.' },
            { type: 'text', content: 'The primary text, <strong>Matthew 18:15</strong>, gives a foundational pattern for personal reconciliation: <em>"If your brother sins against you, go and tell him his fault, between you and him alone."</em> This passage teaches that biblical conflict resolution values truth, directness, privacy, and restoration. It resists gossip, passive aggression, public escalation, and avoidance.' },
            { type: 'callout', emoji: '📌', bg: 'soft-navy', content: '<strong>This lesson especially emphasizes three themes:</strong><br>• <strong>Church conflict causes</strong> - understanding where conflict often comes from.<br>• <strong>Biblical reconciliation</strong> - pursuing restoration through truth, humility, repentance, forgiveness, and direct conversation.<br>• <strong>Protecting unity</strong> - guarding the spiritual health of the church without confusing unity with silence or superficial peace.' },
            { type: 'quote', content: 'J. Oswald Sanders is helpful in emphasizing the moral courage required for conflict work. Timothy Witmer is especially useful in showing that shepherds protect the flock not only from false teaching and external danger, but also from internal breakdown. John MacArthur helps reinforce biblical order, truthfulness, and pastoral responsibility in discipline and reconciliation. Peter Scazzero is particularly valuable because so much church conflict is worsened by emotional immaturity, reactivity, avoidance, triangulation, and unprocessed hurt.<br><br>Teach this lesson with gravity, honesty, and hope. Many participants will carry scars from past church conflict. Some may feel weary or defensive. Others may avoid conflict entirely. The goal is not to make leaders fearful of conflict, but to help them handle it in a way that reflects the wisdom and holiness of Christ.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Teacher Preparation Before the Session' },
            { type: 'bullet_list', content: '1. <strong>Read Matthew 18:15-20 carefully</strong>, especially the progression from private correction to broader involvement.\n2. <strong>Review Ephesians 4 and James 3</strong>, noting how speech, anger, humility, and wisdom affect unity.\n3. <strong>Reflect on recent ministry conflicts:</strong> a conflict handled wisely, a conflict avoided too long, a misunderstanding that escalated unnecessarily, a case where gossip harmed unity, and a situation where reconciliation required courage.\n4. <strong>Prepare one or two ministry examples</strong>, while protecting identities and details appropriately.\n5. <strong>Examine your own conflict instincts:</strong> Do you move toward conflict too aggressively? Do you avoid it out of fear? Do you take sides too quickly? Do you confuse unity with silence? Do you know how to listen before responding?\n6. <strong>Pray for humility and courage</strong>, because conflict resolution requires both tenderness and truth.' },
            { type: 'divider' },
            { type: 'header_h2', content: '60-Minute Teaching Flow' },
            { type: 'text', content: 'The following is a recommended 60-minute outline for the session:<br><br>• <strong>0-5 min</strong>: Opening, prayer, and framing. <em>Purpose: Establish conflict resolution as a normal and necessary leadership responsibility.</em><br>• <strong>5-18 min</strong>: Part 1: Church conflict causes. <em>Purpose: Identify why conflict arises in church life and ministry.</em><br>• <strong>18-30 min</strong>: Part 2: Biblical reconciliation. <em>Purpose: Teach the scriptural pattern for addressing and restoring conflict.</em><br>• <strong>30-40 min</strong>: Part 3: Protecting unity. <em>Purpose: Show how leaders guard unity without compromising truth.</em><br>• <strong>40-50 min</strong>: Part 4: Common mistakes and practical conflict wisdom. <em>Purpose: Expose destructive patterns and provide helpful responses.</em><br>• <strong>50-57 min</strong>: Part 5: Personal diagnostics and reflection. <em>Purpose: Help participants examine their own conflict patterns.</em><br>• <strong>57-60 min</strong>: Summary and closing prayer. <em>Purpose: Reinforce key truths and end in consecration.</em>' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Opening Segment (0-5 Minutes)' },
            { type: 'text', content: 'Begin by asking the participants this opening question:<br><br><strong>"What usually damages a church more — the existence of conflict, or the way conflict is handled?"</strong><br><br>Allow a few brief responses. Then explain that while conflict itself can be painful, mishandled conflict often does the greater damage. Churches are not harmed only by disagreement, but by gossip, pride, silence, public escalation, and the refusal to pursue truth and reconciliation.' },
            { type: 'quote', content: '<strong>Opening Statement for the Teacher:</strong><br>Conflict is not always a sign that ministry has failed. Sometimes it is simply the result of people living and serving closely together in a fallen world. The real test is whether leaders respond with biblical wisdom. Some leaders inflame conflict by harshness. Others deepen it by avoidance. But faithful shepherds learn to move toward conflict with humility, truth, patience, and a desire for restoration. Protecting the church\'s unity does not mean pretending peace exists when it does not. It means pursuing peace in a way that honors Christ.' },
            { type: 'text', content: '<strong>Opening Prayer:</strong><br><em>Father, teach us to handle conflict in ways that reflect your truth, holiness, mercy, and peace. Guard us from pride, gossip, anger, fear, and avoidance. Make us courageous in reconciliation, careful in speech, and faithful in promoting the unity of your people. In Jesus\' name, Amen.</em>' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Church Conflict Causes (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: James 4:1</strong><br>"What causes quarrels and what causes fights among you? Is it not this, that your passions are at war within you?"' },
            { type: 'text', content: '<strong>Teaching Aim:</strong> Participants must understand that church conflict often has multiple layers, including spiritual, relational, emotional, and practical causes.' },
            { type: 'header_h3', content: 'A. Conflict often begins in the heart' },
            { type: 'text', content: 'James reminds us that conflict is not only caused by external events. Inner desires, pride, fear, self-protection, envy, and unmet expectations often intensify outward disputes.<br>• <em>"your passions are at war within you"</em> — James 4:1<br>• <em>"only from pride comes contention"</em> — Proverbs 13:10' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> Leaders must learn to see that many conflicts are not merely about schedules, decisions, or wording. They are often about deeper heart issues.' },
            { type: 'header_h3', content: 'B. Miscommunication and misunderstanding are common causes' },
            { type: 'text', content: 'Not every conflict begins with rebellion or malice. Sometimes people simply misunderstand one another, make assumptions, or react before listening well.<br>• <em>"If one gives an answer before he hears, it is his folly and shame."</em> — Proverbs 18:13' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> Many avoidable conflicts grow because people interpret motives instead of clarifying facts.' },
            { type: 'header_h3', content: 'C. Unmet expectations often create tension' },
            { type: 'text', content: 'Church members, leaders, staff, and volunteers may carry assumptions about roles, care, recognition, decision-making, and communication. When those expectations are not discussed clearly, frustration can grow.' },
            { type: 'header_h3', content: 'D. Pride and competition can inflame ministry conflict' },
            { type: 'text', content: 'Even spiritual settings are not free from ambition, jealousy, comparison, or the desire for control.<br>• <em>"while one of you says, \'I follow Paul,\' or \'I follow Apollos\'"</em> — 1 Corinthians 1:12' },
            { type: 'header_h3', content: 'E. Differences in conviction, maturity, and personality' },
            { type: 'text', content: 'Some conflicts emerge because people differ in conscience, wisdom, pace, communication style, cultural background, or emotional habits.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> Discernment is needed here. Not every difference is a moral failure. Some require patience, teaching, and accommodation.' },
            { type: 'header_h3', content: 'F. Fatigue, stress, and unresolved hurt can magnify conflict' },
            { type: 'text', content: 'People under pressure often speak sharply, assume the worst, or react disproportionately.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> Peter Scazzero is useful here. Emotional immaturity and unresolved pain can turn small tensions into large fractures.' },
            { type: 'header_h3', content: 'G. Gossip and triangulation are major conflict multipliers' },
            { type: 'text', content: 'A concern that should have gone directly to the right person is often spread to others first. This corrodes trust and deepens divisions.<br>• <em>"Whoever goes about slandering reveals secrets, but he who is trustworthy in spirit keeps a thing covered."</em> — Proverbs 11:13' },
            { type: 'quote', content: '<strong>Teacher Illustration:</strong><br>Use this statement: <em>"Church conflict is rarely caused by one thing alone. Usually, several weaknesses meet at the same point — pride, misunderstanding, stress, poor communication, and unguarded speech."</em>' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Which causes of conflict are most common in church life — doctrinal disagreement, personal offense, unmet expectations, pride, poor communication, or unhealed hurt? Why?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Biblical Reconciliation (18-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Matthew 18:15</strong><br>"If your brother sins against you, go and tell him his fault, between you and him alone."' },
            { type: 'text', content: '<strong>Teaching Aim:</strong> Participants should understand that biblical reconciliation is a deliberate pursuit of truth, repentance, forgiveness, and restored relationship wherever possible.' },
            { type: 'header_h3', content: 'A. Reconciliation begins with directness' },
            { type: 'text', content: 'Jesus teaches that the offended person should go directly to the other person privately. This resists gossip, avoidance, and public embarrassment.<br>• <em>"between you and him alone"</em> — Matthew 18:15' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> Private conversation protects dignity and increases the possibility of restoration.' },
            { type: 'header_h3', content: 'B. The goal is restoration, not victory' },
            { type: 'text', content: 'Biblical reconciliation is not about winning arguments, proving superiority, or humiliating the other person. It seeks to gain the brother or sister back.<br>• <em>"If he listens to you, you have gained your brother."</em> — Matthew 18:15' },
            { type: 'header_h3', content: 'C. Reconciliation requires humility' },
            { type: 'text', content: 'A leader or church member should enter conflict aware that he may not see everything clearly and may also need to confess his own part.<br>• <em>"Why do you see the speck that is in your brother\'s eye, but do not notice the log that is in your own eye?"</em> — Matthew 7:3' },
            { type: 'header_h3', content: 'D. Reconciliation requires truthful speech' },
            { type: 'text', content: 'Peace is not built by pretending sin, hurt, or harm did not happen. Biblical peace tells the truth in love.<br>• <em>"speaking the truth in love"</em> — Ephesians 4:15<br>• <em>"let each one of you speak the truth with his neighbor"</em> — Ephesians 4:25' },
            { type: 'header_h3', content: 'E. Reconciliation may require repentance and forgiveness' },
            { type: 'text', content: 'Where there is real sin, there must be real acknowledgment. Where there is repentance, forgiveness must not be withheld in a hard-hearted way.<br>• <em>"If he repents, forgive him."</em> — Luke 17:3<br>• <em>"forgiving each other, as the Lord has forgiven you, so you also must forgive."</em> — Colossians 3:13' },
            { type: 'header_h3', content: 'F. Some conflicts require broader involvement' },
            { type: 'text', content: 'Jesus also gives further steps when private conversation fails. Additional witnesses or church leadership may need to become involved.<br>• <em>"take one or two others along with you"</em> — Matthew 18:16' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> This protects both truth and fairness. It helps prevent false narratives and allows the church to deal responsibly with serious matters.' },
            { type: 'header_h3', content: 'G. Reconciliation is not always instant' },
            { type: 'text', content: 'Some wounds heal slowly. Trust may need rebuilding over time, even where forgiveness has been offered.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> Leaders must not demand emotional speed where real hurt has occurred.' },
            { type: 'quote', content: '<strong>Teacher Illustration:</strong><br>Use this statement: <em>"Biblical reconciliation is not conflict avoidance with spiritual language. It is the courageous pursuit of truth, repentance, forgiveness, and restored fellowship."</em>' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do people often find private, direct reconciliation so difficult, even when they know it is biblical?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Protecting Unity (30-40 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Ephesians 4:1-3</strong><br>"walk in a manner worthy of the calling... with all humility and gentleness, with patience, bearing with one another in love, eager to maintain the unity of the Spirit in the bond of peace."' },
            { type: 'text', content: '<strong>Teaching Aim:</strong> Participants should understand that protecting unity is an active leadership responsibility that requires both grace and truth.' },
            { type: 'header_h3', content: 'A. Unity is precious and must be guarded' },
            { type: 'text', content: 'Scripture does not treat unity as optional. It is a spiritual good that reflects the life of Christ among His people.<br>• <em>"Behold, how good and pleasant it is when brothers dwell in unity!"</em> — Psalm 133:1<br>• <em>"that they may all be one"</em> — John 17:21' },
            { type: 'header_h3', content: 'B. Unity is not the same as uniformity' },
            { type: 'text', content: 'Church unity does not mean everyone thinks, speaks, prefers, or feels exactly the same. Many differences can be carried peacefully within the bond of love.' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> This is important in matters of preference, personality, and non-essential judgments.' },
            { type: 'header_h3', content: 'C. Unity is not preserved by silence alone' },
            { type: 'text', content: 'Some leaders think they are protecting peace when they avoid hard conversations. In reality, unaddressed sin, resentment, and confusion often erode unity more deeply.' },
            { type: 'header_h3', content: 'D. Leaders protect unity through tone as well as decisions' },
            { type: 'text', content: 'Harsh words, public shaming, dismissive attitudes, and careless speech can fracture trust quickly.<br>• <em>"A soft answer turns away wrath, but a harsh word stirs up anger."</em> — Proverbs 15:1<br>• <em>"Let no corrupting talk come out of your mouths, but only such as is good for building up..."</em> — Ephesians 4:29' },
            { type: 'header_h3', content: 'E. Leaders must confront divisive patterns when necessary' },
            { type: 'text', content: 'Protecting unity sometimes means addressing those who spread gossip, stir factions, or refuse peace.<br>• <em>"watch out for those who cause divisions"</em> — Romans 16:17' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> Unity is not protected only by comforting the wounded, but also by restraining what destroys fellowship.' },
            { type: 'header_h3', content: 'F. Shared mission helps strengthen unity' },
            { type: 'text', content: 'Churches often endure differences more faithfully when they remain centered on Christ, truth, worship, and common mission.' },
            { type: 'header_h3', content: 'G. Unity requires ongoing maintenance' },
            { type: 'text', content: 'Unity is not preserved once for all. It must be guarded through humility, patience, forgiveness, clear communication, and wise leadership.' },
            { type: 'quote', content: '<strong>Teacher Illustration:</strong><br>Use this statement: <em>"Unity is not protected by pretending differences do not exist. It is protected when people handle differences in a Christlike way."</em>' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> How can leaders protect unity without becoming afraid of necessary confrontation?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Common Mistakes and Practical Conflict Wisdom (40-50 Minutes)' },
            { type: 'text', content: '<strong>Teaching Aim:</strong> Participants should identify destructive conflict habits and gain practical guidance for responding wisely.' },
            {
                type: 'accordion', items: [
                    { title: 'A. Avoiding the issue too long', content: 'What begins as discomfort can become deeper distrust when left unaddressed.' },
                    { title: 'B. Speaking to others before speaking to the person involved', content: 'This often multiplies confusion and hardens positions.' },
                    { title: 'C. Assuming motives', content: 'People often interpret actions through suspicion instead of asking questions carefully.' },
                    { title: 'D. Escalating too quickly', content: 'Not every issue should become public, formal, or disciplinary immediately.' },
                    { title: 'E. Using Scripture as a weapon', content: 'Truth should heal, correct, and restore, not merely overpower.' },
                    { title: 'F. Taking sides too quickly', content: 'Leaders who listen selectively often lose credibility and worsen divisions.' },
                    { title: 'G. Confusing peacekeeping with peacemaking', content: 'Peacekeeping avoids discomfort. Peacemaking moves toward truth for the sake of real peace.' },
                    { title: 'H. Failing to follow up after reconciliation efforts', content: 'A hard conversation may begin the process, but leaders should also watch for lingering pain, confusion, or relational fragility.' }
                ]
            },
            { type: 'toggle_list', title: '🛠️ Practical Wisdom for Conflict Conversations', content: 'Follow this basic framework to move from reaction to a redemptive process:<br><br>1. <strong>Pray before the conversation:</strong> Seek God\'s heart and self-control first.<br>2. <strong>Clarify the issue carefully:</strong> Separate facts from emotions and rumors.<br>3. <strong>Speak directly to the right person:</strong> Avoid triangulation and gossip.<br>4. <strong>Use calm, truthful, specific language:</strong> Describe events and feelings clearly without hyperbole.<br>5. <strong>Listen fully before responding:</strong> Seek first to understand before being understood.<br>6. <strong>Own your part where necessary:</strong> Apologize sincerely for any mistakes or harsh tone.<br>7. <strong>Seek repentance, understanding, or clarification:</strong> Focus on restoring truth and grace.<br>8. <strong>Pursue forgiveness and practical next steps:</strong> Agree on boundaries and accountability.<br>9. <strong>Involve others only when appropriate:</strong> Follow Matthew 18:16 guidelines if private steps fail.<br>10. <strong>Follow up afterward:</strong> Nurture the relationship and check progress.' },
            { type: 'quote', content: '<strong>Teacher Illustration:</strong><br>Use this statement: <em>"Many conflicts do not become destructive because they exist. They become destructive because people handle them indirectly, emotionally, and without truth."</em>' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Diagnostics and Reflection (50-57 Minutes)' },
            { type: 'text', content: '<strong>Teaching Aim:</strong> Participants should examine how their own habits, wounds, and instincts affect conflict resolution.<br><br><strong>Personal Reflection Exercise:</strong><br>Ask participants to reflect silently or journal on these questions:<br>1. <strong>Conflict Style:</strong> Do I move toward conflict too quickly, too harshly, too slowly, or not at all?<br>2. <strong>Speech:</strong> When I am hurt or frustrated, do I speak directly and truthfully, or indirectly and emotionally?<br>3. <strong>Listening:</strong> Do I listen to understand, or mainly to defend my position?<br>4. <strong>Unity:</strong> Do I truly protect unity, or do I sometimes protect appearances?<br>5. <strong>Humility:</strong> Am I willing to confess my own part in conflict?<br>6. <strong>Courage:</strong> What kinds of conflict do I most avoid, and why?' },
            { type: 'callout', emoji: '💡', bg: 'soft-navy', content: '<strong>Teacher Supplement:</strong> Remind participants that unresolved inner issues often shape external conflict patterns. Some people fight because they are proud. Others avoid because they are afraid. Both patterns can damage the church if left unexamined.' },
            { type: 'bullet_list', content: '- <strong>Ministry Application Questions:</strong>\n- Is there a conflict I need to address directly rather than discussing it indirectly?\n- Are there people in my ministry who need help reconciling?\n- Does my leadership make hard conversations safer or harder?\n- What practical steps would strengthen unity in the ministry I serve?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Conflict is normal in ministry, but mishandled conflict is deeply destructive.\n- Church conflict often has layered causes, not just surface issues.\n- Biblical reconciliation requires directness, humility, truth, and a desire for restoration.\n- Protecting unity does not mean avoiding difficult conversations.\n- Peacemaking is different from peacekeeping.\n- Leaders must resist gossip, assumption, harshness, and delay.\n- Faithful conflict resolution strengthens both holiness and unity in the church.' },
            { type: 'quote', content: '<strong>Closing Prayer (57-60 Minutes):</strong><br><em>Lord, make us peacemakers who love truth and pursue reconciliation with humility and courage. Guard our mouths from careless speech, our hearts from pride and bitterness, and our leadership from fear and avoidance. Teach us to protect the unity of your people without compromising holiness, and help us reflect the grace and truth of Christ in every conflict we face. In Jesus\' name, Amen.</em>' },
            { type: 'toggle_list', title: '📚 Supplementary Notes for the Teacher', content: '<strong>1. Key Terms to Explain Simply:</strong><br>• <strong>Conflict resolution</strong> - addressing disagreements or offenses in a truthful and redemptive way.<br>• <strong>Reconciliation</strong> - the restoring of broken relationship through truth, repentance, forgiveness, and peace.<br>• <strong>Peacekeeping</strong> - avoiding tension without dealing with the real issue.<br>• <strong>Triangulation</strong> - involving third parties in a conflict before speaking directly to the person involved.<br><br><strong>2. Common Ministry Errors This Lesson Corrects:</strong><br>• Treating conflict as automatically unspiritual.<br>• Ignoring conflict until it becomes severe.<br>• Gossiping instead of addressing issues directly.<br>• Mistaking silence for unity.<br>• Confronting harshly rather than redemptively.<br>• Using reconciliation language without real repentance or truthfulness.<br>• Involving too many people too early.<br>• Failing to guard the church from divisive behavior.<br><br><strong>3. Suggested Teacher Illustrations:</strong><br>• <strong>The splinter illustration</strong> - a small unresolved issue can become deeply painful if neglected.<br>• <strong>The cracked wall illustration</strong> - conflict left unattended often spreads beyond the original point.<br>• <strong>The bridge illustration</strong> - reconciliation is the costly work of building a path back toward peace.<br><br><strong>4. Reference Integration for the Teacher:</strong><br>• <strong>J. Oswald Sanders - Spiritual Leadership:</strong> Use Sanders to reinforce courage, self-control, humility, and the moral seriousness of handling conflict faithfully.<br>• <strong>Timothy Witmer - The Shepherd Leader:</strong> Use Witmer to connect conflict resolution to shepherding, especially in protecting the flock, preserving health, and guiding people toward peace.<br>• <strong>John MacArthur - Pastoral Ministry:</strong> Use MacArthur to emphasize biblical order, truthfulness, church discipline, and responsible pastoral leadership in conflict settings.<br>• <strong>Peter Scazzero - Emotionally Healthy Spirituality:</strong> Use Scazzero to expose avoidance, reactivity, emotional immaturity, triangulation, and unresolved pain that often inflame church conflict.' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> Matthew 18:15-20; Ephesians 4:1-32; James 3:13-18<br>2. <strong>Journal:</strong> What is my usual conflict pattern, and how has it helped or harmed ministry?<br>3. <strong>Practice:</strong> Identify one unresolved tension and take one biblical step toward direct, peaceful resolution.<br>4. <strong>Ministry Audit:</strong> Consider whether gossip, silence, unclear communication, or avoidance is weakening unity in your ministry context.<br>5. <strong>Memory Verse:</strong> Ephesians 4:3' },
            { type: 'quote', content: '<strong>Short Teacher Wrap-Up Statement:</strong><br>Conflict resolution is where a leader\'s theology of grace, truth, holiness, and unity becomes visible in real relationships. It is one thing to preach peace; it is another to pursue it through hard conversations, humble repentance, and faithful reconciliation. Wise leaders do not merely react to conflict — they help redeem it for the health of Christ\'s church.' },
            { type: 'multiple_choice', question: 'According to Matthew 18:15, what is the critical first step in resolving a personal offense?', options: ['Tell a trusted friend or leader first', 'Go directly and tell them their fault alone', 'Address it publicly in a group meeting', 'Wait until they realize their mistake and apologize'], correct_index: 1, explanation: 'Matthew 18:15 — "If your brother sins against you, go and tell him his fault, between you and him alone." Private directness preserves dignity and prevents gossip.' },
            { type: 'matching', pairs: [{ left: 'Peacemaking', right: 'Pursuing truth, repentance, and restored relationships' }, { left: 'Peacekeeping', right: 'Avoiding tension or hard talks to keep a superficial calm' }, { left: 'Triangulation', right: 'Involving a third person in a conflict instead of speaking directly' }, { left: 'Directness', right: 'Going to the person privately (Matthew 18:15)' }] },
            { type: 'question', content: 'Reflect honestly on your personal conflict instincts. Write a detailed response (minimum 20 characters) answering: Are you more prone to conflict avoidance (peacekeeping) or aggressive confrontation, and what specific biblical principle or practice from this lesson will you implement to pursue redemptive reconciliation?' },
            { type: 'file_upload', title: 'Module 11 Assignment', content: 'Upload your completed Conflict Reflection Journal or Ministry Unity Audit for this week.' }
        ]
    },
    module12: {
        title: "Team Leadership",
        subtitle: "Building healthy, sustainable, and empowered ministry teams based on biblical principles.",
        components: [
            { type: 'header_h1', content: 'Week 12: Team Leadership' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand team leadership as a biblical and practical necessity in ministry.<br>2. Recognize the importance of delegation in equipping others and preventing pastoral burnout.<br>3. Develop practical elements of team building, delegation, and empowerment.<br>4. Delineate responsibilities and authorities cleanly to prevent team conflict.<br>5. Evaluate whether their current leadership model is functional and sustainable.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Session Overview for the Teacher' },
            { type: 'text', content: 'This lesson moves from conflict resolution into the practical work of team building. Ministry is not meant to be carried by one person. Moses tried this and almost broke himself, his family, and the people. Christian leadership is a shared burden, and the church is healthiest when every member is properly equipped and active.' },
            { type: 'text', content: 'Moses’ father-in-law Jethro gives him counsel that remains a masterpiece of wisdom. Jethro observes: "The work is too heavy for you; you cannot do it alone... You will wear yourself out—both you and this people" (Exodus 18:18). Jethro’s counsel focuses on three priorities: Intercession (standing before God for the people), Instruction (teaching them the statutes and decisions, showing them the way to walk), and Delegation (selecting capable, trustworthy leaders to share the burden).' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Teacher Preparation Before the Session' },
            { type: 'bullet_list', content: '1. <strong>Reflection:</strong> Do you struggle to delegate? Is it due to fear of loss of control, perfectionism, or past disappointment?\n2. <strong>Capacity Check:</strong> Are the people you lead growing in capacity or merely dependent on you?\n3. <strong>Clarity Check:</strong> How clear are the roles and responsibilities in your ministry?\n4. <strong>Weariness Check:</strong> Are you experiencing signs of weariness or burnout?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Delegation — Sharing the Load (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Exodus 18:17-23</strong><br>"Moses\' father-in-law said to him, \'What you are doing is not good. You and the people with you will certainly wear yourselves out, for the thing is too heavy for you. You are not able to do it alone.\'"' },
            { type: 'header_h3', content: 'A. Delegation is a biblical mandate, not a modern management technique' },
            { type: 'text', content: 'Moses’ father-in-law confronted him because his solo leadership was bad for him and bad for the people. Leaders must share the workload to sustain long-term effectiveness.' },
            { type: 'header_h3', content: 'B. Delegation requires character first' },
            { type: 'text', content: 'Jethro did not suggest delegating to just anyone, but to: "able men from all the people, such as fear God, men of truth, hating covetousness" (Ex. 18:21).' },
            { type: 'header_h3', content: 'C. Delegation is not abdication' },
            { type: 'text', content: 'Jethro\'s model includes training, oversight, and a clear escalation path. The leaders handle the small matters; Moses handles the major ones.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why is it hard to delegate? Is it because we think we can do it better, or because we fear losing control, or because we don\'t want to invest the time to train others?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Empowering Volunteers — Building the Body (18-30 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Ephesians 4:11-12, 16</strong><br>"...to equip the saints for the work of ministry, for building up the body of Christ... from whom the whole body, joined and held together by every joint with which it is equipped, when each part is working properly, makes the body grow so that it builds itself up in love."' },
            { type: 'header_h3', content: 'A. Volunteers are the ministry, not just helpers' },
            { type: 'text', content: 'Volunteers are not helpers for the pastor’s ministry; they are the ministry. The pastor’s role is to equip the saints for the work of ministry.' },
            { type: 'header_h3', content: 'B. True empowerment requires three elements' },
            { type: 'bullet_list', content: '- <strong>Authority:</strong> Giving them the responsibility and the freedom to make decisions within their scope.\n- <strong>Resources:</strong> Providing the tools, training, and support they need.\n- <strong>Accountability:</strong> Regular check-ins to encourage, evaluate, and align.' },
            { type: 'header_h3', content: 'C. People grow when they are trusted' },
            { type: 'text', content: 'If we micro-manage, we restrict growth and create dependency. If we empower, we release spiritual gifts and build a strong body.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Think of a volunteer in your ministry. Are you micro-managing them or empowering them? What is one step you can take to empower them more this week?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Avoiding Pastoral Burnout — Protecting the Leader (30-45 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Galatians 6:9, 1 Kings 19:1-18</strong><br>"And let us not grow weary of doing good, for in due season we will reap, if we do not give up."' },
            { type: 'header_h3', content: 'A. Burnout is a real danger' },
            { type: 'text', content: 'Spiritual leaders are not immune to emotional, physical, and spiritual exhaustion. Moses was at risk (Ex. 18:18); Elijah crashed after Mount Carmel (1 Kings 19).' },
            { type: 'header_h3', content: 'B. Root causes of burnout' },
            { type: 'bullet_list', content: '- <strong>Over-responsibility:</strong> Carrying burdens God never intended us to carry.\n- <strong>Isolation:</strong> Leading alone without a team or peer support.\n- <strong>Neglecting rest:</strong> Failing to practice Sabbath and personal renewal.\n- <strong>Unrealistic expectations:</strong> Trying to please everyone and avoid all conflict.' },
            { type: 'header_h3', content: 'C. Restoring the weary leader' },
            { type: 'bullet_list', content: '- <strong>Silence & Solitude:</strong> Reconnect with God in silence and solitude.\n- <strong>Rest:</strong> Rest and physical care (food, sleep).\n- <strong>Reframing:</strong> Recognizing that God is the one who builds the church.\n- <strong>Sharing:</strong> Appointing others to carry the weight.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Evaluate your current energy and stress levels on a scale of 1-10. What is one practical boundary you need to set to protect your health and ministry?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Practical Team Leadership Wisdom — Structure and Culture (45-50 Minutes)' },
            { type: 'header_h3', content: 'A. Team leadership requires structure, not just relationship' },
            { type: 'text', content: 'Structure protects roles and ensures clarity. Essential structures for a healthy team include clear roles, clear lines of authority, regular communication, and a conflict resolution path.' },
            { type: 'header_h3', content: 'B. Team leadership requires a healthy culture, not just structure' },
            { type: 'text', content: 'Culture is the atmosphere of the team. Essential cultural elements include trust (believing the best), humility (willingness to listen and learn), clarity (honest and direct communication), and grace (allowing room for mistakes).' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Look at your team or ministry. What is stronger: your structures or your culture? What needs more attention?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Diagnostics and Reflection (50-57 Minutes)' },
            { type: 'text', content: 'This segment is for personal application. Leaders must evaluate their own practices.' },
            { type: 'bullet_list', content: '- <strong>Delegation check:</strong> Am I carrying tasks that others could and should do?\n- <strong>Empowerment check:</strong> Am I equipping and trusting others, or doing it all myself?\n- <strong>Burnout check:</strong> Am I practicing rest and boundary setting?\n- <strong>Team check:</strong> Am I building a healthy team structure and culture?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Team leadership is a biblical necessity, not a modern option.\n- Delegation is essential for equipping others and preventing burnout.\n- Empowerment requires authority, resources, and accountability.\n- Burnout is prevented through boundaries, rest, and shared leadership.\n- Healthy teams require both clear structures and a healthy culture.' },
            { type: 'quote', content: '<strong>Closing Prayer (57-60 Minutes):</strong><br><em>Lord, deliver us from the pride of solo leadership. Give us the humility to delegate, the wisdom to equip, and the grace to empower others. Protect us from burnout, and help us build healthy, sustainable teams that reflect the body of Christ. In Jesus\' name, Amen.</em>' },
            { type: 'toggle_list', title: '📚 Supplementary Notes for the Teacher', content: '<strong>1. Sanders on Spiritual Leadership:</strong> Reinforce that leadership is influence, and influence is multiplied through others.<br><strong>2. Witmer on the Shepherd Leader:</strong> Connect team leadership to shepherding, showing how a team of shepherds can care for the flock more effectively than a single leader.<br><strong>3. Scazzero on Emotional Health:</strong> Connect burnout prevention to emotional health, showing that a leader\'s ministry cannot be healthier than their personal life.' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> Exodus 18 and Ephesians 4.<br>2. <strong>Ministry Audit:</strong> List all your weekly tasks. Identify 2-3 tasks you can delegate to others this week.<br>3. <strong>Dialogue:</strong> Speak with a key volunteer or team member. Ask them how you can better empower them in their role.<br>4. <strong>Memory Verse:</strong> Memorize Exodus 18:18.' },
            { type: 'multiple_choice', question: 'According to Jethro\'s counsel in Exodus 18:21, what are the primary character traits required for delegated leaders?', options: ['Highly educated, charismatic, and popular', 'Fear God, men of truth, and hating covetousness', 'Experienced in business, wealthy, and influential', 'Young, energetic, and willing to work long hours'], correct_index: 1, explanation: 'Exodus 18:21 — "...select capable men from all the people—men who fear God, trustworthy men who hate a dishonest gain..." Character and integrity are the primary qualifications.' },
            { type: 'matching', pairs: [{ left: 'Intercession', right: 'Standing before God on behalf of the people' }, { left: 'Instruction', right: 'Teaching the statutes, decisions, and way to walk' }, { left: 'Delegation', right: 'Selecting capable, trustworthy leaders to share the burden' }, { left: 'Empowerment', right: 'Giving authority, resources, and accountability' }] },
            { type: 'question', content: 'Reflect on Jethro\'s counsel. Write a detailed response (minimum 20 characters) answering: What is the single most important change you need to make in your leadership style based on this lesson, and how will you start this week?' },
            { type: 'file_upload', title: 'Module 12 Assignment', content: 'Upload your completed weekly Ministry Task Audit or dialogue notes showing how you plan to delegate and empower others.' }
        ]
    },
    module13: {
        title: "Church Administration",
        subtitle: "Establishing governance structures, defining elder roles, and implementing protective policies.",
        components: [
            { type: 'header_h1', content: 'Week 13: Church Administration' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand church administration as a biblical and practical responsibility.<br>2. Recognize the importance of clean governance structures for accountability and order.<br>3. Distinguish the roles of elders, pastors, and other leaders cleanly.<br>4. Appreciate the value of clear church policies in protecting people, assets, and process.<br>5. Diagnose how administration minimizes conflict and vulnerability in ministry.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Session Overview for the Teacher' },
            { type: 'text', content: 'This lesson moves into the often neglected but deeply important area of church administration. Some leaders hear that phrase and immediately think of paperwork, meetings, and procedures. But biblically, administration is much more than bureaucracy. It is the wise ordering of church life so that leadership is sustainable, ministry is dynamic, people are protected, and the mission of the church can be carried out faithfully.' },
            { type: 'text', content: 'Healthy churches do not drift into order by accident. They require clear structures, defined responsibilities, and consistent practices. When governance is weak, roles become confused, decisions become personal rather than principled, and conflict is common. Administration must never outperform or replace spiritual vitality; rather, it serves to protect and maximize it.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Teacher Preparation Before the Session' },
            { type: 'bullet_list', content: '1. <strong>Read Titus 1:5-9 carefully:</strong> Notice the connection between order, leadership, and qualifications.\n2. <strong>Review Acts 6:1-7, 1 Timothy 3:1-7, and 1 Peter 5:1-4:</strong> Pay attention to responsibility, unity, and accountability.\n3. <strong>Reflection:</strong> Review your own leadership context. Where does confusion or friction occur most often due to structural gaps?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Governance Structure — Ordering the Church (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Titus 1:5</strong><br>"This is why I left you in Crete, so that you might put what remained into order, and appoint elders in every town as I directed you."' },
            { type: 'header_h3', content: 'A. Governance provides order' },
            { type: 'text', content: 'Paul\'s instruction to Titus shows that churches do not simply need spiritual zeal; they also need order. Administrative setup defines who leads, who decides, who is accountable, and how the church functions in practice.' },
            { type: 'header_h3', content: 'B. Governance protects accountability' },
            { type: 'text', content: 'Without a clear structure, authority becomes vague or centralized in an unhealthy way. Structure protects the team by ensuring multiple mature leaders share the load.' },
            { type: 'header_h3', content: 'C. Governance reduces confusion' },
            { type: 'text', content: 'Many conflicts grow because boundaries are assumed rather than clearly defined. Good governance helps prevent overlapping duties and operational friction.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do some churches resist clear governance structures even when confusion causes repeated problems?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Elders and Pastoral Roles — Defining the Leadership Team (18-32 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Texts: 1 Timothy 3:1-7, 1 Peter 5:1-4</strong><br>"Shepherd the flock of God that is among you, exercising oversight, not under compulsion, but willingly, as God would have you..." (1 Peter 5:2)' },
            { type: 'header_h3', content: 'A. Leadership is character-driven before it is managerial' },
            { type: 'text', content: 'In 1 Timothy 3 and Titus 1, the emphasis is almost entirely on character, not management techniques. Leaders must be spiritually mature, self-controlled, and respected.' },
            { type: 'header_h3', content: 'B. Elders are called to shepherd and oversee' },
            { type: 'text', content: 'The New Testament model highlights plural leadership. Elders share the responsibility for spiritual oversight, protecting the flock from false teaching, and guiding the church.' },
            { type: 'header_h3', content: 'C. Teaching and oversight are core pastoral functions' },
            { type: 'text', content: 'While all elders share oversight, some pastors specifically dedicate themselves to regular preaching, teaching, and full-time administration.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What most commonly weakens pastoral leadership: character flaws, unclear lines of authority, or a lack of shared responsibility?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Church Policies — Protecting the Ministry (32-45 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Corinthians 14:40</strong><br>"But all things should be done decently and in order."' },
            { type: 'header_h3', content: 'A. Policies provide clarity before problems arise' },
            { type: 'text', content: 'Written policies establish clear standards for handling key areas like finances, building use, human resources, and safety before issues occur. This removes personal bias from critical decisions.' },
            { type: 'header_h3', content: 'B. Policies protect people and assets' },
            { type: 'text', content: 'Clear guidelines protect vulnerable individuals through child safety rules and protect leaders from false accusations or financial mismanagement through robust accounting protocols.' },
            { type: 'header_h3', content: 'C. Policies are servants, not masters' },
            { type: 'text', content: 'Policies provide wisdom and order, but they should never choke ministry flexibility or replace relational grace. They should be reviewed periodically to ensure they remain helpful.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do churches often delay writing clear operational policies until after a major problem has already occurred?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Practical Administrative Wisdom (45-54 Minutes)' },
            { type: 'header_h3', content: 'A. Make leadership structures visible' },
            { type: 'text', content: 'People should easily understand how the church is organized, who holds responsibility for specific areas, and where decisions are finalized.' },
            { type: 'header_h3', content: 'B. Define roles explicitly' },
            { type: 'text', content: 'Confusion vanishes when lines of authority match the assigned tasks. Write down clear definitions for jobs and expectations.' },
            { type: 'header_h3', content: 'C. Build accountability into the workflow' },
            { type: 'text', content: 'Healthy administration features regular check-ins, transparent record-keeping, and shared oversight of financial and legal assets.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> In your church administration, which element needs the most immediate attention: clarifying authority, document archiving, or balancing policy with grace?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Diagnostics and Reflection (54-57 Minutes)' },
            { type: 'text', content: 'Use these diagnostics to evaluate the administrative health of your current ministry environment:' },
            { type: 'bullet_list', content: '- <strong>Governance Check:</strong> Is the leadership structure clear, or do people work within vague assumptions?\n- <strong>Roles Check:</strong> Are the roles of elders, pastors, and coordinators clearly understood and respected?\n- <strong>Policy Check:</strong> Which critical ministries or operations are currently operating without clear policy guidelines?\n- <strong>Accountability Check:</strong> Where is the system most vulnerable to administrative breakdown or a lack of oversight?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Church administration is a biblical necessity that supports spiritual life.\n- Clean governance structures protect authority and prevent centralized overreach.\n- Elders and pastors are called to lead through mature character and shared oversight.\n- Operational policies protect people, safeguard assets, and minimize operational friction.\n- Visible structures and explicit roles create clarity and trust.' },
            { type: 'quote', content: '<strong>Closing Prayer (57-60 Minutes):</strong><br><em>Lord, grant us wisdom to lead your church with order, humility, and faithfulness. Help us build structures and policies that serve your people well and honor your name. Raise up leaders who lead with integrity and manage your house with care. In Jesus\' name, Amen.</em>' },
            { type: 'toggle_list', title: '📚 Supplementary Notes for the Teacher', content: '<strong>1. Alexander Strauch on Biblical Eldership:</strong> Use Strauch\'s work to reinforce the value of plural leadership and the explicit spiritual qualifications required for elders.<br><strong>2. Jeramie Rinne on Church Elders:</strong> Highlight Rinne\'s emphasis on elders as shepherds who track the spiritual health of the flock, rather than acting purely as business board directors.' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> Titus 1 and 1 Timothy 3.<br>2. <strong>Structure Audit:</strong> Map out your current church governance lines. Identify any areas where authority or accountability is vague.<br>3. <strong>Policy Review:</strong> Select one current church policy (e.g., child safety or financial handling) and review it for clarity and current relevance.' },
            { type: 'multiple_choice', question: 'According to Titus 1:5, why did Paul leave Titus in Crete?', options: ['To raise financial support for missions', 'To put what remained into order and appoint elders', 'To build a new church facility', 'To conduct an evangelistic campaign'], correct_index: 1, explanation: 'Titus 1:5 explicitly states that Titus was left in Crete to put things in order and appoint qualified elders in every city.' },
            { type: 'matching', pairs: [{ left: 'Governance', right: 'The structure of authority, responsibility, and accountability' }, { left: 'Oversight', right: 'The spiritual care, protection, and direction of the church' }, { left: 'Policy', right: 'A clear guideline for handling important operational matters' }, { left: 'Accountability', right: 'Being answerable for decisions, conduct, and stewardship' }] },
            { type: 'question', content: 'Reflect on the administration of your ministry. What is one specific structural or policy improvement you will initiate this week based on this lesson?' },
            { type: 'file_upload', title: 'Module 13 Assignment', content: 'Upload your completed Structure Audit diagram or your updated policy review notes.' }
        ]
    },
    module14: {
        title: "Financial Stewardship",
        subtitle: "Implementing financial integrity, budget oversight, and transparency in ministry.",
        components: [
            { type: 'header_h1', content: 'Week 14: Financial Stewardship' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand financial stewardship as a spiritual and practical responsibility in ministry.<br>2. Recognize the necessity of integrity in handling church finances.<br>3. Develop a clear understanding of budget oversight as an act of wise stewardship.<br>4. Appreciate the value of transparency in building trust and protecting the church.<br>5. Observe how poor financial practices can damage witness, leadership credibility, and ministry health.<br>6. Evaluate whether their current financial systems reflect biblical standards and accountability.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Session Overview for the Teacher' },
            { type: 'text', content: 'This lesson addresses the important and sensitive subject of financial stewardship in church and ministry life. Money is never merely a practical matter; it is a spiritual indicator. Money is connected to trust, faithfulness, responsibility, contentment, and integrity. For that reason, the way a church handles finances is never secondary to its ministry.' },
            { type: 'text', content: 'Many churches do not face their greatest financial problems because of a lack of separate funds, but because of weak systems, broken accountability, careless oversight, or a lack of transparency. Even where there is no dishonesty, poor financial habits can create confusion, suspicion, and preventable errors. A ministry must avoid temptation by operating honorably, ensuring financial practices are transparent and secure.' },
            { type: 'text', content: 'The primary text, 2 Corinthians 8:20-21, is especially important because Paul explains his effort to handle financial matters in a way that avoids blame and displays what is right "not only in the Lord\'s sight but also in the sight of man." That is a powerful foundation for our study.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Teacher Preparation Before the Session' },
            { type: 'bullet_list', content: '1. <strong>Read 2 Corinthians 8:16-24 carefully:</strong> Note Paul\'s concern for financial credibility.\n2. <strong>Review Luke 16:10-12, 1 Corinthians 4:2, and Acts 6:1-6:</strong> Focus on faithfulness, trust, and practical oversight.\n3. <strong>Reflection:</strong> Reflect on your current ministry financial practices. What financial safety protocols are currently lacking?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Integrity in Finances — Doing What is Right (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 2 Corinthians 8:20-21</strong><br>"We take this precaution so that no one should blame us about this generous gift that is being administered by us, for we aim at what is honorable not only in the Lord\'s sight but also in the sight of man."' },
            { type: 'header_h3', content: 'A. Financial integrity is a spiritual marker' },
            { type: 'text', content: 'Money is never morally neutral in ministry. The handling of financial resources reveals the character of leaders and the seriousness with which they treat God\'s tools.' },
            { type: 'header_h3', content: 'B. Integrity includes both character and structure' },
            { type: 'text', content: 'A church should not depend only on the personal honesty of a few people. Wise systems help protect honest people and expose weak practices before they become serious failures.' },
            { type: 'header_h3', content: 'C. Bring-above-reproach matters' },
            { type: 'text', content: 'Paul did not merely want to be innocent; he wanted to avoid blame through careful handling. Leaders must aim not only for actual integrity, but also for clear, public, and verifiable practices.' },
            { type: 'header_h3', content: 'D. Integrity requires separation of duties where possible' },
            { type: 'bullet_list', content: '- More than one person involved in counting or receiving funds\n- Documented approval sequences\n- Recorded transactions\n- Regular reports\n- Secure handling of cash and offerings' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do public concerns about financial integrity sometimes arise even when no actual fraud or theft has taken place?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Budget Oversight — Wise Management (18-32 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Luke 16:10-12</strong><br>"One who is faithful in a very little is also faithful in much, and one who is dishonest in a very little is also dishonest in much."' },
            { type: 'header_h3', content: 'A. A budget reflects values' },
            { type: 'text', content: 'How a church plans and spends its money reveals what it truly prioritizes. Budgets are not only financial tools; they are ministry statements.' },
            { type: 'header_h3', content: 'B. Budget oversight is part of stewardship' },
            { type: 'text', content: 'Wise leaders do not simply treat funds as they arrive. They plan, review, and evaluate to ensure resources are used properly.' },
            { type: 'header_h3', content: 'C. Oversight requires regular review' },
            { type: 'text', content: 'A budget framework must be monitored and clear. Good stewardship includes reviewing income, expenses, changes in need, and actual spending patterns over time.' },
            { type: 'header_h3', content: 'D. Oversight helps prevent drift' },
            { type: 'text', content: 'Without budget oversight, ministries can slowly overspend, neglect key priorities, or make decisions based on impulse rather than direction.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What causes more common budget challenges: a lack of planning, weak review, emotional spending, unclear priorities, or poor volume control?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Transparency — Building Trust (32-45 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Corinthians 4:2</strong><br>"Moreover, it is required of stewards that they be found faithful."' },
            { type: 'header_h3', content: 'A. Transparency builds trust' },
            { type: 'text', content: 'People are most likely to trust leadership when financial processes are clear, accountable, and accessible to them.' },
            { type: 'header_h3', content: 'B. Transparency does not mean disorderly exposure of everything' },
            { type: 'text', content: 'Transparency should be wise and appropriate. Not every detail needs to be public in the same way, but financial handling should not be hidden, vague, or secret.' },
            { type: 'header_h3', content: 'C. Openness protects both leaders and congregation' },
            { type: 'text', content: 'Open reports, approvals, and dynamic balances leave no vulnerability to suspicion, and numbers are less vulnerable to misuse.' },
            { type: 'header_h3', content: 'D. Transparency requires understandable reporting' },
            { type: 'text', content: 'Financial reports should be accurate, timely, clear, and understandable to the appropriate audience.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do some churches become uncomfortable with financial transparency even when they have nothing to hide?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Practical Financial Wisdom — Principles and Balance (45-54 Minutes)' },
            { type: 'header_h3', content: 'A. Separate financial responsibilities wisely' },
            { type: 'text', content: 'Avoid concentrating receiving, recording, approving, and reviewing in one person whenever possible.' },
            { type: 'header_h3', content: 'B. Put financial processes in writing' },
            { type: 'text', content: 'Key procedures should be clear and documented rather than left to memory or habit.' },
            { type: 'header_h3', content: 'C. Review budgets regularly' },
            { type: 'text', content: 'Budget stewardship requires periodic review, not annual analysis only.' },
            { type: 'header_h3', content: 'D. Require clear approval pathways' },
            { type: 'text', content: 'Spending should follow agreed authority and process structures.' },
            { type: 'header_h3', content: 'E. Keep accurate records' },
            { type: 'text', content: 'Full tracking is strengthened by careful documentation.' },
            { type: 'header_h3', content: 'F. Report clearly to the right people' },
            { type: 'text', content: 'Financial communication should match the level of responsibility and accountability required.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> In your current financial management, which practice needs improvement: separating tracking duties, writing down procedures, or regular financial reporting?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Diagnostics and Reflection (54-57 Minutes)' },
            { type: 'text', content: 'Use these questions to evaluate financial stewardship in your personal life and ministry assignment:' },
            { type: 'bullet_list', content: '- <strong>Integrity Check:</strong> Are our financial processes above reproach, or are they simply standard?\n- <strong>Oversight Check:</strong> Do we actively track expenditures against a budget framework, or do we review updates reactively?\n- <strong>Transparency Check:</strong> Would our congregation find our reporting methods clear and reassuring?\n- <strong>Risk Check:</strong> What is the single biggest administrative gap that leaves our funds or leaders vulnerable to error or suspicion?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Financial stewardship is a spiritual responsibility, not just a practical necessity.\n- Integrity in finances requires both honorable character and robust systems.\n- Budget oversight aligns resources with mission and prevents financial drift.\n- Transparency strengthens trust and protects both leaders and the congregation.\n- Separation of duties and clear records minimize vulnerability and error.' },
            { type: 'quote', content: '<strong>Closing Prayer (57-60 Minutes):</strong><br><em>Lord, teach us to steward resources with faithfulness, honesty, and wisdom. Protect us from greed, carelessness, secrecy, and disorder. Help us handle finances in ways that strengthen trust, support your work, and bring honor before both you and the watching world. In Jesus\' name, Amen.</em>' },
            { type: 'toggle_list', title: '📚 Supplementary Notes for the Teacher', content: '<strong>1. Randy Alcorn on Money, Possessions, and Eternity:</strong> Highlight Alcorn\'s focus on the absolute spiritual weight of money, stewardship, and eternal perspective.<br><strong>2. John Maxwell on Developing the Leader Within You:</strong> Review Maxwell\'s principles for building leadership integrity, credibility, and disciplined oversight.<br><strong>3. Jamie Dunlop on Budgeting for a Healthy Church:</strong> Emphasize Dunlop\'s guidance on linking budget oversight directly to mission, priorities, and church health.' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> 2 Corinthians 8-9 and Luke 16:1-13.<br>2. <strong>Process Audit:</strong> Map out your current church financial flow from collections to expenditure. Identify any gaps in accountability or documentation.<br>3. <strong>Budget Review:</strong> Review the current budget structure against actual spending trends from the last quarter.' },
            { type: 'multiple_choice', question: 'According to 2 Corinthians 8:21, what double standard did Paul aim to meet when administering the financial gift?', options: ['Managing it quickly and spending it completely', 'Honorable not only in the Lord\'s sight but also in the sight of man', 'Investing it wisely and growing it significantly', 'Keeping it confidential and secure from outside observers'], correct_index: 1, explanation: '2 Corinthians 8:21 explicitly sets the standard: "For we aim at what is honorable not only in the Lord\'s sight but also in the sight of man."' },
            { type: 'matching', pairs: [{ left: 'Integrity', right: 'Being honest, careful, and above reproach' }, { left: 'Stewardship', right: 'Faithfully managing resources that belong to God' }, { left: 'Budgeting', right: 'Planning, tracking, and allocating financial tools' }, { left: 'Transparency', right: 'Keeping records open, clear, and accountable' }] },
            { type: 'question', content: 'Reflect on your current financial oversight. What is one specific structural change or improvement you will prioritize this week based on this lesson?' },
            { type: 'file_upload', title: 'Module 14 Assignment', content: 'Upload your completed Process Audit map or budget structure review notes.' }
        ]
    },
    module15: {
        title: "Character and Emotional Intelligence",
        subtitle: "Developing self-awareness, handling criticism constructively, and cultivating emotional maturity in leadership.",
        components: [
            { type: 'header_h1', content: 'Week 15: Character and Emotional Intelligence' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand why character and emotional maturity are essential to spiritual leadership.<br>2. Develop an intentional practice of healthy self-awareness and integrity.<br>3. Discover a biblical approach to handling criticism without defensive collapse.<br>4. Observe the marks of emotional maturity in a leader\'s inner life and relationships.<br>5. Diagnose how emotional immaturity can damage ministry teams, family, and personal faithfulness.<br>6. Evaluate whether their current habits of reflection, humility, and self-control match biblical standards.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Session Overview for the Teacher' },
            { type: 'text', content: 'This lesson focuses on the deeply important subject of character and emotional intelligence in leadership. A ministry is not uniquely built or ruined by technical failures; it is shaped by the character, maturity, and emotional health of the leader. A highly gifted leader with low self-awareness or unbridled emotional triggers can easily undo years of faithful labor.' },
            { type: 'text', content: 'Many leadership failures are not caused by a lack of knowledge, but by a hidden battle with insecurity, pride, fear of failure, or an inability to regulate emotion. Emotional maturity is the capacity to remain connected, clear, and grounded under pressure, and it must be intentionally cultivated over time. The primary text, Proverbs 4:23, anchors this lesson: "Keep your heart with all vigilance, for from it flow the springs of life."' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Teacher Preparation Before the Session' },
            { type: 'bullet_list', content: '1. <strong>Read Proverbs 4:23 carefully:</strong> Reflect on what it means to guard your heart with vigilance.\n2. <strong>Review James 1:19-20, Romans 12:3, and Galatians 5:22-23:</strong> Pay close attention to topics of humility, listening, and self-control.\n3. <strong>Self-Examination:</strong> Honestly review your recent emotional patterns. How do you naturally handle unexpected criticism or high-stress situations?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Self-Awareness — Knowing Yourself Before Leading Others (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Texts: Psalm 139:23-24, Romans 12:3</strong><br>"Search me, O God, and know my heart... And lead me in the way everlasting."<br>"For by the grace given to me I say to everyone among you not to think of himself more highly than he ought to think, but to think with sober judgment..."' },
            { type: 'header_h3', content: 'A. Self-awareness is a form of humility' },
            { type: 'text', content: 'True self-awareness is not about self-absorption; it is accurate self-knowledge under God\'s grace. It allows us to recognize our limitations, gifts, and blind spots without slipping into pride or despair.' },
            { type: 'header_h3', content: 'B. Leaders who lack self-awareness project their issues onto others' },
            { type: 'text', content: 'When we do not understand our own internal pressures or unmet needs, we often misinterpret other people\'s motives, make reactive decisions, and fracture team trust.' },
            { type: 'header_h3', content: 'C. Self-awareness includes knowing your triggers' },
            { type: 'text', content: 'A mature leader knows what situations trigger anxiety, anger, defensiveness, or impatience, and learns to slow down before reacting. Common triggers include feeling unappreciated, excluded, or out of control.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Why do some leaders resist self-awareness or constructive feedback even when it is obvious their current blind spots are hurting the team?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Handling Criticism — Discerning Truth from Noise (18-32 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Texts: Proverbs 17:10, James 1:19-20</strong><br>"A rebuke goes deeper into a man of understanding than a hundred blows into a fool."<br>"Let every person be quick to hear, slow to speak, slow to anger..."' },
            { type: 'header_h3', content: 'A. Criticism is inevitable in leadership' },
            { type: 'text', content: 'Anyone who leads people will eventually face opposition, misunderstanding, or critique. Leadership without criticism does not exist.' },
            { type: 'header_h3', content: 'B. Not all criticism is equal or accurate' },
            { type: 'text', content: 'Some criticism is helpful, accurate, and delivered with love. Other criticism may be inaccurate, malicious, or born out of someone else\'s personal preferences. A leader must separate valid critique from personal attacks.' },
            { type: 'header_h3', content: 'C. Defensiveness blocks spiritual growth' },
            { type: 'text', content: 'When our first instinct is self-protection or counter-attack, we miss out on what God might be trying to teach us through a difficult message.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What makes criticism so hard to digest gracefully—is it pride, insecurity, fear of failure, or a past wound?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Emotional Maturity — Staying Grounded Under Pressure (32-45 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Texts: Galatians 5:22-23, Ephesians 4:26-32</strong><br>"But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control..."' },
            { type: 'header_h3', content: 'A. Emotional maturity is not the absence of emotion' },
            { type: 'text', content: 'A healthy leader still feels anger, disappointment, or grief. Maturity means these emotions are expressed in healthy, constructive ways rather than driving destructive outbursts or passive-aggressive behavior.' },
            { type: 'header_h3', content: 'B. Spiritual activity does not guarantee emotional maturity' },
            { type: 'text', content: 'It is possible to be highly active in church programs while remaining defensive, reactive, and insecure. True transformation must touch our emotional habits.' },
            { type: 'header_h3', content: 'C. Maturity is proven through practices, not theory' },
            { type: 'text', content: 'Emotional maturity is demonstrated in real-time interactions: staying calm under pressure, listening to differing viewpoints without getting threatened, and extending genuine forgiveness.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> How can a leader distinguish between healthy spiritual zeal and an anxious, reactive emotional state masking itself as "ministry urgency"?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Practical Growth Wisdom — Cultivating Character (45-54 Minutes)' },
            { type: 'header_h3', content: 'A. Practice reflective space regularly' },
            { type: 'text', content: 'Instead of rushing from one meeting to the next, build in time for prayer, journaling, and self-assessment to process heavy emotional data.' },
            { type: 'header_h3', content: 'B. Invite feedback from a trusted circle' },
            { type: 'text', content: 'Have a small group of trusted mentors or peers who have permission to speak honestly into your life and highlight your blind spots.' },
            { type: 'header_h3', content: 'C. Separate identity from performance' },
            { type: 'text', content: 'When your worth is tied directly to the success or failure of your ministry tasks, you become defensive and fragile. Rest your identity securely in Christ.' },
            { type: 'header_h3', content: 'D. Slow down your response rate under pressure' },
            { type: 'text', content: 'When triggered or criticized, pause. Do not reply immediately to an email or address a conflict while your adrenaline is spiking.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> Which practice will help you grow most right now: building in reflective space, inviting honest feedback, or slowing down your responses under pressure?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Diagnostics and Reflection (54-57 Minutes)' },
            { type: 'text', content: 'Take time to answer these personal evaluation diagnostics honestly:' },
            { type: 'bullet_list', content: '- <strong>Self-Awareness Check:</strong> Can I identify my top three emotional triggers accurately right now?\n- <strong>Criticism Check:</strong> Do I naturally respond to feedback with self-protection, counter-arguments, or a willingness to listen?\n- <strong>Maturity Check:</strong> Do I allow my emotional state to dictate my tone, language, and behavior with those I lead?\n- <strong>Identity Check:</strong> Am I treating ministry success or failure as a direct measure of my personal value?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Character and emotional intelligence are primary prerequisites for sustainable ministry.\n- Self-awareness is an act of humility that guards against projecting inner conflict onto others.\n- Criticism is inevitable; a mature leader learns to separate helpful truth from noise.\n- Emotional maturity is proven by maintaining relational connection and self-control under pressure.\n- Personal character must be anchored in Christ, independent of external performance.' },
            { type: 'quote', content: '<strong>Closing Prayer (57-60 Minutes):</strong><br><em>Lord, examine our hearts and grant us the grace of true self-awareness. Deliver us from the pride of defensiveness and the fragility of tying our identity to performance. Cultivate your Spirit\'s fruit within us so we can lead with maturity, humility, and love. In Jesus\' name, Amen.</em>' },
            { type: 'toggle_list', title: '📚 Supplementary Notes for the Teacher', content: '<strong>1. Peter Scazzero on Emotionally Healthy Spirituality:</strong> Emphasize Scazzero\'s core truth: It\'s impossible to be spiritually mature while remaining emotionally immature.<br><strong>2. Daniel Goleman on Emotional Intelligence:</strong> Connect spiritual maturity to the core elements of emotional intelligence: self-awareness, self-regulation, empathy, and relationship management.<br><strong>3. Henry Cloud on Necessary Endings:</strong> Use Cloud\'s principles to discuss how clean emotional boundaries protect personal health, families, and long-term ministry impact.' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Read:</strong> Psalm 139 and James 1.<br>2. <strong>Trigger Log:</strong> Throughout the week, write down moments you felt emotionally triggered, defensive, or anxious. Analyze what drove that reaction.<br>3. <strong>Feedback Dialogue:</strong> Ask a trusted peer or leader: "What is one blind spot you see in my communication or leadership style that I might be missing?"' },
            { type: 'multiple_choice', question: 'According to Proverbs 17:10, how does a rebuke affect a man of understanding compared to a fool?', options: ['It makes him bitter and discouraged', 'It goes deeper into him than a hundred blows into a fool', 'It has no effect on his established behavior', 'It causes him to immediately defend his reputation'], correct_index: 1, explanation: 'Proverbs 17:10 explicitly states: "A rebuke goes deeper into a man of understanding than a hundred blows into a fool."' },
            { type: 'matching', pairs: [{ left: 'Self-Awareness', right: 'Accurate self-knowledge and tracking our emotional habits' }, { left: 'Criticism', right: 'Inevitable feedback that must be weighed with wisdom' }, { left: 'Maturity', right: 'The capacity to maintain connection and composure under stress' }, { left: 'Identity', right: 'Anchoring our personal worth completely in Christ' }] },
            { type: 'question', content: 'Reflect on a recent situation where you felt defensive or reactive. What did that reaction reveal about your underlying emotional triggers, and how will you apply this lesson next time?' },
            { type: 'file_upload', title: 'Module 15 Assignment', content: 'Upload your personal Trigger Log or reflections from your feedback dialogue.' }
        ]
    },
    module16: {
        title: "Visionary Leadership",
        subtitle: "Casting vision, implementing strategic planning, and leading sustainable church growth.",
        components: [
            { type: 'header_h1', content: 'Week 16: Visionary Leadership' },
            { type: 'callout', emoji: '🎯', bg: 'soft-gold', content: '<strong>Learning Objectives:</strong> By the end of this session, participants will:<br>1. Understand visionary leadership as the ability to discern, articulate, and mirror God\'s purposeful direction.<br>2. Recognize that dynamic growth requires alignment, structure, and strategic planning.<br>3. Develop a biblical strategy that values numbers for health without falling into pure numeric goals.<br>4. Delineate differences between physical expansion, personal maturation, and organizational stability.<br>5. Present and evaluate a comprehensive, final project presentation integrating the major themes of the course.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Session Overview for the Teacher' },
            { type: 'text', content: 'This final lesson binds together all previous indicators into the practice of visionary leadership. Throughout the series, participants have looked at personal character, team collaboration, administration, and oversight. Visionary leadership brings these elements together for a clear sense of direction. Visionary leadership focus is not generic optimism; rather, it is the capacity to trace where God is working, map out steps to develop elements for destination points, and inspire people toward a shared, customized plan with real milestones.' },
            { type: 'text', content: 'Many churches and ministries collapse or fall behind because they lack this forward activity. They wrap their activity completely around the present context. Without vision, leaders default to a maintenance mindset, only reacting to immediate needs, or tracking routines without progress. In contrast, visionary leadership moves intentionally, shapes a path, and measures results, ensuring that the local platform remains operational, healthy, and filled with careful growth rather than structural decline.' },
            { type: 'text', content: 'The primary text, Habakkuk 2:2, emphasizes communication clearly so the runner can run. Vision must be specific, visible, and written down, establishing a path that protects both the leader and the organization. This is a crucial model of visionary leadership balance.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Teacher Preparation Before the Session' },
            { type: 'bullet_list', content: '1. <strong>Read Habakkuk 2:2-3 carefully:</strong> Note the timeline element and the command to write the vision down clearly.\n2. <strong>Review Acts 1:8, Nehemiah 2:1-20, and Ephesians 4:11-16:</strong> Track how large visions translate to structural layout, strategy, execution, and local ministry roles.\n3. <strong>Self-Assessment:</strong> Reflect on your current ministry direction. Is it clear enough that others can run with it, or does it exist purely as an unwritten concept?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 1: Casting Vision — Defining the Horizon (5-18 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Habakkuk 2:2</strong><br>"And the Lord answered me: \'Write the vision; make it plain on tablets, so he may run who reads it.\'"' },
            { type: 'header_h3', content: 'A. Vision begins with spiritual character and clarity' },
            { type: 'text', content: 'Vision is not self-generated ambition. It is the result of seeking God\'s face, discerning His direction, and finding a clear, compelling framework for the ministry that aligns with biblical commands.' },
            { type: 'header_h3', content: 'B. Vision must be communicated plainly' },
            { type: 'text', content: 'Habakkuk is told to write the vision down clearly. An unwritten vision is just a dream. True visionary leadership ensures that goals, values, and directions are accessible so others can align their efforts.' },
            { type: 'header_h3', content: 'C. Vision demands execution and patience' },
            { type: 'text', content: '"For still the vision awaits its appointed time... if it seems slow, wait for it; it will surely come" (Habakkuk 2:3). Vision looks ahead but respects structural timing and pacing.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What most often neutralizes a healthy vision: a lack of clear writing, poor planning, half-hearted communication, or a lack of personal alignment?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 2: Strategic Planning — Mapping the Path (18-32 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: Luke 14:28</strong><br>"For which of you, desiring to build a tower, does not first sit down and count the cost, whether he has enough to complete it?"' },
            { type: 'header_h3', content: 'A. Planning is not opposed to faith' },
            { type: 'text', content: 'Jesus uses the imagery of building a tower to show that planning is essential. Discerning a vision requires immediate translation into practical strategy, resources, timing, and responsibilities.' },
            { type: 'header_h3', content: 'B. Strategic plan architecture' },
            { type: 'text', content: 'A comprehensive strategic plan should include: Mission (why the ministry exists), Core Values (how it behaves), Objectives (what it wants to accomplish), Strategy (how it intends to do it), and Evaluation (how it measures success).' },
            { type: 'header_h3', content: 'C. Strategic plans should create flexible tracking, not rigid templates' },
            { type: 'text', content: 'A strategic plan is not a fixed document. It serves to align efforts, maximize resources, and create realistic benchmarks, but must remain adaptable as the ministry context shifts.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What breaks down more often in strategic planning: unrealistic goals, weak execution structures, poor communication, or a lack of initial assessment?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 3: Leading Church Growth — Nurturing Health (32-45 Minutes)' },
            { type: 'callout', emoji: '📖', bg: 'soft-gold', content: '<strong>Primary Focus Text: 1 Corinthians 3:6-7</strong><br>"I planted, Apollos watered, but God gave the growth. So neither he who plants nor he who waters is anything, but only God who gives the growth."' },
            { type: 'header_h3', content: 'A. Growth is divine, but systems must support it' },
            { type: 'text', content: 'Paul reminds us that growth is ultimately from God. However, the leader is responsible for planting and watering—meaning the creation of systems, structures, and environments where health can thrive.' },
            { type: 'header_h3', content: 'B. True church growth is multi-dimensional' },
            { type: 'text', content: 'Healthy growth is never purely numerical. It includes: Spiritual Growth (deepening maturity), Structural Growth (strengthening systems and leadership capacity), and Numerical Growth (expanding reach).' },
            { type: 'header_h3', content: 'C. Growth requires scalability' },
            { type: 'text', content: 'As a ministry grows, its leadership structures must adapt. Plurality in leadership, delegation, and clear decentralization prevent the senior leaders from becoming a bottleneck to growth.' },
            { type: 'callout', emoji: '❓', bg: 'soft-red', content: '<strong>Discussion Prompt:</strong> What type of growth does your current ministry context need most right now: spiritual depth, structural clarity, numerical expansion, or balanced health across all three?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 4: Final Project Presentation & Review (45-54 Minutes)' },
            { type: 'text', content: 'This final module segment allows participants to synthesize the entire course into a cohesive, actionable plan for their local ministry context.' },
            { type: 'bullet_list', content: '- <strong>Project Scope:</strong> Bring together the core assignments from the 16 weeks into a unified local plan.\n- <strong>Core Components:</strong> Showcase updates across personal metrics, administrative structures, policy outlines, budget frameworks, and team strategies.\n- <strong>Presentation Goal:</strong> Present clear, concise, and verifiable destination points showing how you will execute this framework moving forward.' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Part 5: Personal Diagnostics and Course Reflection (54-57 Minutes)' },
            { type: 'text', content: 'Evaluate your development across the complete track using these core checks:' },
            { type: 'bullet_list', content: '- <strong>Vision Check:</strong> Is your ministry vision clearly documented and shared with your team?\n- <strong>Strategy Check:</strong> Do you have an actionable roadmap for the next 6-12 months?\n- <strong>Health Check:</strong> Are your growth targets balanced across spiritual, structural, and numerical goals?\n- <strong>Stewardship Check:</strong> Are you leading out of a healthy personal life and guarded character, avoiding burnout?' },
            { type: 'divider' },
            { type: 'header_h2', content: 'Summary: Key Takeaways' },
            { type: 'bullet_list', content: '- Visionary leadership is a biblical necessity that protects a church from aimless stagnation.\n- Vision must be written down plainly so that others can align and run with it.\n- Strategic planning maps out practical pathways, resources, and evaluation tools.\n- Healthy growth comes from God but requires scalable, supportive human systems.\n- True leadership health matches outward impact with structural and personal integrity.' },
            { type: 'quote', content: '<strong>Closing Prayer (57-60 Minutes):</strong><br><em>Lord, grant us the grace of clear vision and the wisdom to plan strategically for your glory. Deliver us from a maintenance mindset and give us the courage to build scalable, healthy systems. We commit this entire masterclass journey to you; establish the work of our hands and build your church. In Jesus\' name, Amen.</em>' },
            { type: 'toggle_list', title: '📚 Supplementary Notes for the Teacher', content: '<strong>1. J. Oswald Sanders on Spiritual Leadership:</strong> Reinforce Sanders\' principles regarding the absolute necessity of visionary foresight, courage, and spiritual alignment in tracking objectives.<br><strong>2. Timothy Witmer on The Shepherd Leader:</strong> Emphasize Witmer\'s model showing that a clear strategic vision must protect the personal care and shepherding of every individual member.<br><strong>3. Peter Scazzero on Emotional Health:</strong> Finalize the track by connecting long-term strategic vision directly to the internal character and structural sanity of the leadership team.' },
            { type: 'toggle_list', title: '📝 Optional Homework for the Week', content: '1. <strong>Final Compilation:</strong> Assemble all weekly assignment items into your completed Masterclass Ministry Plan portfolio.<br>2. <strong>Vision Communication:</strong> Share your updated 3-page vision summary document with your core leadership team or board for feedback.<br>3. <strong>Implementation Schedule:</strong> Set exact calendar dates for executing the structural and policy updates developed during this course.' },
            { type: 'multiple_choice', question: 'According to Habakkuk 2:2, why must the vision be made plain on tablets?', options: ['So it can be preserved for historical records', 'So he may run who reads it', 'To satisfy administrative requirements', 'To prevent outside opposition from changing it'], correct_index: 1, explanation: 'Habakkuk 2:2 explicitly states the reason for clear, public documentation: "...make it plain on tablets, so he may run who reads it."' },
            { type: 'matching', pairs: [{ left: 'Vision', right: 'Discerning and documenting God\'s clear direction' }, { left: 'Strategy', right: 'Mapping out practical pathways, timelines, and budgets' }, { left: 'Growth', right: 'Balanced scaling across spiritual, structural, and numerical areas' }, { left: 'Synthesis', right: 'Compiling the entire course into a functional local plan' }] },
            { type: 'question', content: 'Reflect on your entire 16-week masterclass journey. What is the single most transformative shift that has occurred in your leadership style, and what is your immediate next action step this week?' },
            { type: 'file_upload', title: 'Module 16 Final Portfolio Submission', content: 'Upload your completed, comprehensive Masterclass Local Ministry Plan portfolio document here.' }
        ]
    }
};

// --- Local database initializations ---

// Initialize DB if empty
if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify([]));
}

// Initialize archived modules list
if (!localStorage.getItem(ARCHIVED_KEY)) {
    localStorage.setItem(ARCHIVED_KEY, JSON.stringify([]));
}

// Initialize unlocked modules (Module 1 unlocked by default)
if (!localStorage.getItem(UNLOCKED_KEY)) {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(['module1']));
}

// Initialize module contents with database migration check (v1.7 for Modules 3-10 full curriculum)
const DB_VERSION = 'v1.8';
if (!localStorage.getItem(CONTENT_KEY)) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(defaultModules));
}
if (!localStorage.getItem('jilgm_db_version')) {
    localStorage.setItem('jilgm_db_version', DB_VERSION);
}

// --- Shared Key-Value Cloud Sync Fallback (real-time sync for multiple admins & students) ---
let syncPromise = null;

async function syncFromCloud() {
    try {
        const resMod = await fetch(SYNC_URL + 'modules');
        if (resMod.ok) {
            const data = await resMod.json();
            if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                localStorage.setItem(CONTENT_KEY, JSON.stringify(data));
            } else {
                console.log("Fetched cloud modules are incomplete or empty. Overwriting with local defaultModules and seeding...");
                localStorage.setItem(CONTENT_KEY, JSON.stringify(defaultModules));
                await saveToCloud('modules', defaultModules);
            }
        } else {
            console.log("Failed to fetch cloud modules. Falling back to local defaultModules seeding check...");
            await checkAndSeedModules();
        }

        const resUnlock = await fetch(SYNC_URL + 'unlocked');
        if (resUnlock.ok) {
            const data = await resUnlock.json();
            if (Array.isArray(data)) {
                localStorage.setItem(UNLOCKED_KEY, JSON.stringify(data));
            }
        }

        const resAnn = await fetch(SYNC_URL + 'announcements');
        if (resAnn.ok) {
            const data = await resAnn.json();
            if (Array.isArray(data)) {
                localStorage.setItem('jilgm_announcements', JSON.stringify(data));
            }
        }

        const resRes = await fetch(SYNC_URL + 'resources');
        if (resRes.ok) {
            const data = await resRes.json();
            if (Array.isArray(data)) {
                localStorage.setItem('jilgm_resources', JSON.stringify(data));
            }
        }

        const resStud = await fetch(SYNC_URL + 'students');
        if (resStud.ok) {
            const data = await resStud.json();
            if (Array.isArray(data)) {
                localStorage.setItem(DB_KEY, JSON.stringify(data));
            }
        }

        const resInst = await fetch(SYNC_URL + 'instructors');
        if (resInst.ok) {
            const data = await resInst.json();
            if (Array.isArray(data)) {
                localStorage.setItem('jilgm_instructors', JSON.stringify(data));
            }
        }

        const resAdmins = await fetch(SYNC_URL + 'admins');
        if (resAdmins.ok) {
            const data = await resAdmins.json();
            if (Array.isArray(data) && data.length > 0) {
                // Keep only the main admin
                const filteredData = [{
                    username: 'JILGM RiyadhRC',
                    password: '061577D',
                    isMain: true
                }];
                localStorage.setItem('jilgm_admins', JSON.stringify(filteredData));
                if (data.length > 1 || data[0].username !== 'JILGM RiyadhRC') {
                    saveToCloud('admins', filteredData);
                }
            }
        }
        triggerStorageSync('jilgm_admins');
    } catch (e) {
        console.warn("Cloud synchronization offline, running on local database cache:", e);
    }
}

async function saveToCloud(key, data) {
    try {
        await fetch(SYNC_URL + key, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.error("Cloud database synchronization failed:", e);
    }
}

async function checkAndSeedModules() {
    // This function no longer overwrites Firestore with defaults.
    // Firebase is the source of truth. We only need local defaults
    // as a fallback if localStorage is empty AND Firebase hasn't loaded yet.
    // The real sync happens in initFirestoreSync via onSnapshot.
    const stored = localStorage.getItem(CONTENT_KEY);
    if (!stored) {
        // Temporarily seed localStorage from defaultModules so the UI
        // isn't blank while waiting for the Firestore snapshot to arrive.
        console.log("localStorage empty — seeding temporary defaults while waiting for Firestore sync...");
        localStorage.setItem(CONTENT_KEY, JSON.stringify(defaultModules));
        // NOTE: We do NOT write to Firestore here. Firebase is the source of truth.
    }
}
checkAndSeedModules();

// --- Firebase Integration ---
let firebaseDb = null;
let isFirebaseInitialized = false;

function withTimeout(promise, timeoutMs = 8000, errorMessage = "Database request timed out. Please try again.") {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(errorMessage));
        }, timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => {
        clearTimeout(timeoutId);
    });
}

function initFirestoreSync(onCollectionLoaded) {
    if (!firebaseDb) return;

    let flags = {
        students: false,
        announcements: false,
        resources: false,
        modules_content: false,
        unlocked_modules: false,
        archived_modules: false,
        admins: false,
        instructors: false,
        module_order: false
    };

    const markLoaded = (key) => {
        if (!flags[key]) {
            flags[key] = true;
            if (typeof onCollectionLoaded === 'function') {
                onCollectionLoaded(key);
            }
        }
    };

    const currentAdmin = AuthAPI.getCurrentAdmin();
    const currentInstructor = AuthAPI.getCurrentInstructor();
    const currentUser = AuthAPI.getCurrentUser();
    const isTeacherOrAdmin = currentAdmin || currentInstructor;

    // 1. Sync students
    if (isTeacherOrAdmin) {
        // Admins and instructors sync all students
        firebaseDb.collection('students').onSnapshot(snapshot => {
            const students = [];
            snapshot.forEach(doc => {
                students.push({ id: doc.id, ...doc.data() });
            });
            window.liveStudents = students;
            localStorage.setItem(DB_KEY, JSON.stringify(students));
            triggerStorageSync(DB_KEY);
            markLoaded('students');
        }, err => {
            console.error("Firestore sync students error", err);
            markLoaded('students');
        });
    } else if (currentUser && currentUser.id) {
        // Students sync only their own document
        firebaseDb.collection('students').doc(currentUser.id).onSnapshot(doc => {
            if (doc.exists) {
                const student = { id: doc.id, ...doc.data() };
                window.liveStudents = [student];
                localStorage.setItem(DB_KEY, JSON.stringify([student]));
                localStorage.setItem(SESSION_KEY, JSON.stringify(student));
                triggerStorageSync(DB_KEY);
            }
            markLoaded('students');
        }, err => {
            console.error("Firestore sync current student error", err);
            markLoaded('students');
        });
    } else {
        // Guest mode (login/register pages): skip syncing students
        markLoaded('students');
    }

    // 2. Sync announcements with local badge increment logic
    if (isTeacherOrAdmin || currentUser) {
        let previousAnnouncementsLength = null;
        firebaseDb.collection('announcements').orderBy('date', 'desc').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            if (previousAnnouncementsLength !== null && list.length > previousAnnouncementsLength) {
                const diff = list.length - previousAnnouncementsLength;
                const currentBadge = parseInt(localStorage.getItem('jilgm_unread_announcements') || '0');
                localStorage.setItem('jilgm_unread_announcements', (currentBadge + diff).toString());
            }
            previousAnnouncementsLength = list.length;
            localStorage.setItem('jilgm_announcements', JSON.stringify(list));
            triggerStorageSync('jilgm_announcements');
            markLoaded('announcements');
        }, err => {
            console.error("Firestore sync announcements error", err);
            markLoaded('announcements');
        });
    } else {
        markLoaded('announcements');
    }

    // 3. Sync resources
    if (isTeacherOrAdmin || currentUser) {
        firebaseDb.collection('resources').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            localStorage.setItem('jilgm_resources', JSON.stringify(list));
            triggerStorageSync('jilgm_resources');
            markLoaded('resources');
        }, err => {
            console.error("Firestore sync resources error", err);
            markLoaded('resources');
        });
    } else {
        markLoaded('resources');
    }

    // 4. Sync modules content
    firebaseDb.collection('modules_content').onSnapshot(snapshot => {
        if (snapshot.empty) {
            if (isTeacherOrAdmin) {
                // Seed defaults
                const batch = firebaseDb.batch();
                Object.keys(defaultModules).forEach(id => {
                    batch.set(firebaseDb.collection('modules_content').doc(id), defaultModules[id]);
                });
                batch.commit().then(() => markLoaded('modules_content')).catch(err => {
                    console.error("Firestore seeding modules error", err);
                    markLoaded('modules_content');
                });
            } else {
                markLoaded('modules_content');
            }
            return;
        }
        const mods = {};
        snapshot.forEach(doc => {
            mods[doc.id] = doc.data();
        });

        // Firebase is the source of truth — never overwrite existing docs with defaults.
        // Only seed docs that are completely missing from Firestore (no document at all).
        if (isTeacherOrAdmin) {
            const archivedList = AuthAPI.getArchivedModules();
            const archivedIds = archivedList.map(m => m.id);
            Object.keys(defaultModules).forEach(id => {
                if (!mods[id] && !archivedIds.includes(id)) {
                    // This module ID doesn't exist in Firestore at all and is not archived — safe to seed
                    console.log(`Safe Seeding: Adding new module ${id} to Firestore (did not exist)...`);
                    firebaseDb.collection('modules_content').doc(id).set(defaultModules[id])
                        .catch(err => console.error(`Error seeding new module ${id} in Firestore`, err));
                }
                // If the doc already exists, leave it completely untouched.
            });
        }

        localStorage.setItem(CONTENT_KEY, JSON.stringify(mods));
        triggerStorageSync(CONTENT_KEY);
        markLoaded('modules_content');
    }, err => {
        console.error("Firestore sync modules content error", err);
        markLoaded('modules_content');
    });

    // 5. Sync unlocked modules
    firebaseDb.collection('settings').doc('unlocked_modules').onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            if (data && data.list) {
                localStorage.setItem(UNLOCKED_KEY, JSON.stringify(data.list));
                triggerStorageSync(UNLOCKED_KEY);
            }
            markLoaded('unlocked_modules');
        } else {
            if (isTeacherOrAdmin) {
                firebaseDb.collection('settings').doc('unlocked_modules').set({ list: ['module1'] })
                    .then(() => markLoaded('unlocked_modules'))
                    .catch(err => {
                        console.error("Firestore sync unlocked modules error", err);
                        markLoaded('unlocked_modules');
                    });
            } else {
                markLoaded('unlocked_modules');
            }
        }
    }, err => {
        console.error("Firestore sync unlocked modules error", err);
        markLoaded('unlocked_modules');
    });

    // 5.5 Sync module order
    firebaseDb.collection('settings').doc('module_order').onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            if (data && data.list) {
                // Permanently update module_order in Firestore if module11 is missing
                if (isTeacherOrAdmin) {
                    const archivedList = AuthAPI.getArchivedModules();
                    const archivedIds = archivedList.map(m => m.id);
                    let migrated = false;
                    Object.keys(defaultModules).forEach(id => {
                        if (!data.list.includes(id) && !archivedIds.includes(id)) {
                            data.list.push(id);
                            migrated = true;
                        }
                    });
                    if (migrated) {
                        firebaseDb.collection('settings').doc('module_order').set({ list: data.list })
                            .catch(err => console.error("Error migrating module_order in Firestore", err));
                    }
                }
                localStorage.setItem(ORDER_KEY, JSON.stringify(data.list));
                triggerStorageSync(ORDER_KEY);
            }
            markLoaded('module_order');
        } else {
            if (isTeacherOrAdmin) {
                const defaultOrder = Object.keys(defaultModules);
                firebaseDb.collection('settings').doc('module_order').set({ list: defaultOrder })
                    .then(() => markLoaded('module_order'))
                    .catch(err => {
                        console.error("Firestore sync module order error", err);
                        markLoaded('module_order');
                    });
            } else {
                markLoaded('module_order');
            }
        }
    }, err => {
        console.error("Firestore sync module order error", err);
        markLoaded('module_order');
    });

    // 6. Sync archived modules
    if (isTeacherOrAdmin) {
        firebaseDb.collection('archived_modules').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            localStorage.setItem(ARCHIVED_KEY, JSON.stringify(list));
            triggerStorageSync(ARCHIVED_KEY);
            markLoaded('archived_modules');
        }, err => {
            console.error("Firestore sync archived modules error", err);
            markLoaded('archived_modules');
        });
    } else {
        markLoaded('archived_modules');
    }

    // 7. Sync admins
    if (isTeacherOrAdmin || !currentUser) {
        firebaseDb.collection('admins').onSnapshot(snapshot => {
            let list = [];
            snapshot.forEach(doc => {
                if (doc.id !== 'JILGM RiyadhRC') {
                    // Purge any non-main admin document from Firestore
                    firebaseDb.collection('admins').doc(doc.id).delete().catch(e => console.error("Purging admin error", e));
                } else {
                    list.push(doc.data());
                }
            });
            // Ensure main admin is set
            if (!list.some(a => a.username === 'JILGM RiyadhRC')) {
                const newMain = {
                    username: 'JILGM RiyadhRC',
                    password: '061577D',
                    isMain: true,
                    displayName: 'JILGM RiyadhRC'
                };
                list.push(newMain);
                firebaseDb.collection('admins').doc('JILGM RiyadhRC').set(newMain).catch(e => console.error("Firestore set new admin error", e));
            }
            localStorage.setItem('jilgm_admins', JSON.stringify(list));
            triggerStorageSync('jilgm_admins');
            markLoaded('admins');
        }, err => {
            console.error("Firestore sync admins error", err);
            markLoaded('admins');
        });
    } else {
        markLoaded('admins');
    }

    // 8. Sync instructors
    if (isTeacherOrAdmin || !currentUser) {
        firebaseDb.collection('instructors').onSnapshot(snapshot => {
            const list = [];
            snapshot.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            window.liveInstructors = list;
            localStorage.setItem('jilgm_instructors', JSON.stringify(list));

            // Sync current instructor session if they are logged in
            const currentInst = AuthAPI.getCurrentInstructor();
            if (currentInst) {
                const freshInst = list.find(i => i.id === currentInst.id);
                if (freshInst) {
                    localStorage.setItem('jilgm_current_instructor', JSON.stringify(freshInst));
                }
            }

            triggerStorageSync('jilgm_instructors');
            markLoaded('instructors');
        }, err => {
            console.error("Firestore sync instructors error", err);
            markLoaded('instructors');
        });
    } else {
        markLoaded('instructors');
    }
}

function toHex(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return result;
}

function fromHex(hex) {
    let result = '';
    for (let i = 0; i < hex.length; i += 2) {
        result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return result;
}

async function saveFirebaseConfigToBootstrap(configObj) {
    try {
        const hex = toHex(JSON.stringify(configObj));
        await fetch('https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/jilgmryd/firebase_config/' + hex, {
            method: 'POST',
            headers: { 'Content-Length': '0' }
        });
    } catch (e) {
        console.error("Failed to upload Firebase configuration to bootstrap service:", e);
    }
}

async function clearFirebaseConfigFromBootstrap() {
    try {
        await fetch('https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/jilgmryd/firebase_config/empty', {
            method: 'POST',
            headers: { 'Content-Length': '0' }
        });
    } catch (e) {
        console.error("Failed to clear Firebase configuration from bootstrap service:", e);
    }
}

// Coordinated sync flow
window.syncPromise = (async () => {
    // 1. First sync remote Firebase configuration from the bootstrap KV cloud DB (keyvalue.immanuel.co)
    try {
        const resFb = await fetch('https://keyvalue.immanuel.co/api/KeyVal/GetValue/jilgmryd/firebase_config');
        let cloudConfig = null;
        if (resFb.ok) {
            const rawVal = await resFb.json();
            if (rawVal && rawVal !== 'empty' && rawVal !== 'null' && rawVal !== 'test_value' && rawVal !== 'test_custom') {
                try {
                    const decoded = fromHex(rawVal);
                    cloudConfig = JSON.parse(decoded);
                } catch (err) {
                    console.error("Error decoding bootstrap Firebase configuration:", err);
                }
            }
        }

        const localConfigStr = localStorage.getItem('jilgm_firebase_config');

        // Strictly validate both cloud and local Firebase configuration objects before sync/backup
        if (cloudConfig && typeof cloudConfig === 'object' && cloudConfig.apiKey && cloudConfig.projectId && cloudConfig.appId) {
            localStorage.setItem('jilgm_firebase_config', JSON.stringify(cloudConfig));
        } else if (localConfigStr) {
            try {
                const localConfig = JSON.parse(localConfigStr);
                if (localConfig && localConfig.apiKey && localConfig.projectId && localConfig.appId) {
                    console.log("Backing up local Firebase configuration to the bootstrap cloud...");
                    await saveFirebaseConfigToBootstrap(localConfig);
                }
            } catch (err) { }
        }
    } catch (e) {
        console.warn("Bootstrap cloud fetch for Firebase configuration offline or skipped:", e);
    }

    // Skip old KVdb cloud fetch completely since we are 100% Firebase
    // await syncFromCloud();

    // 3. Centralized Firebase configuration is imported from firebase.js


    const initializeFirebaseWithConfig = () => {
        return new Promise((resolve) => {
            try {
                let configToUse = firebaseConfig;
                try {
                    const stored = localStorage.getItem('jilgm_firebase_config');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (parsed && parsed.apiKey && parsed.projectId && parsed.appId) {
                            configToUse = parsed;
                        }
                    }
                } catch (err) {
                    console.error("Error reading config for initialization in auth.js:", err);
                }

                // Avoid initializing app if already initialized
                if (firebase.apps.length === 0) {
                    firebase.initializeApp(configToUse);
                }
                firebaseDb = firebase.firestore();
                isFirebaseInitialized = true;
                console.log("Firebase initialized successfully");

                let loadedCount = 0;
                const totalToLoad = 8;
                let resolved = false;

                const triggerResolve = () => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                };

                // Fallback timeout to guarantee page load
                setTimeout(triggerResolve, 1500);

                initFirestoreSync(() => {
                    loadedCount++;
                    if (loadedCount >= totalToLoad) {
                        triggerResolve();
                    }
                });
            } catch (err) {
                console.error("Firebase initializeApp or firestore failed:", err);
                isFirebaseInitialized = false;
                firebaseDb = null;
                resolve(); // Resolve so window.syncPromise is not blocked
            }
        });
    };

    if (typeof firebase !== 'undefined') {
        return initializeFirebaseWithConfig();
    }

    return new Promise((resolve) => {
        try {
            const appScript = document.createElement('script');
            appScript.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
            appScript.onload = () => {
                const firestoreScript = document.createElement('script');
                firestoreScript.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js";
                firestoreScript.onload = () => {
                    initializeFirebaseWithConfig().then(resolve);
                };
                document.head.appendChild(firestoreScript);
            };
            document.head.appendChild(appScript);
        } catch (err) {
            console.error("Coordinated Firebase initialization failed:", err);
            resolve();
        }
    });
})();


// Maintain backward compatibility for pages expecting window.firebaseSyncPromise
window.firebaseSyncPromise = window.syncPromise;

const AuthAPI = {
    saveFirebaseConfig: async (configObj) => {
        localStorage.setItem('jilgm_firebase_config', JSON.stringify(configObj));
        await saveToCloud('firebase_config', configObj);
        await saveFirebaseConfigToBootstrap(configObj);
    },

    clearFirebaseConfig: async () => {
        localStorage.removeItem('jilgm_firebase_config');
        await saveToCloud('firebase_config', {});
        await clearFirebaseConfigFromBootstrap();
    },

    getAllStudents: () => {
        if (window.liveStudents && window.liveStudents.length > 0) {
            return window.liveStudents;
        }
        try {
            const data = localStorage.getItem(DB_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error parsing students DB", e);
            return [];
        }
    },

    // Step 1: Enrollee registers (Pending Status)
    registerStudent: async (firstName, lastName, email, outreach = "", isSitIn = false) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        try {
            const snapshotPromise = firebaseDb.collection('students')
                .where('email', '==', email)
                .get();
            const snapshot = await withTimeout(snapshotPromise, 8000, "Registration check timed out. Please check your internet connection.");

            if (!snapshot.empty) {
                return { error: 'Email already registered.' };
            }

            const newStudent = {
                firstName,
                lastName,
                email,
                outreach,
                status: 'pending',
                username: null,
                password: null,
                progress: 0,
                answers: [],
                dateAdded: new Date().toISOString(),
                isSitIn: !!isSitIn
            };

            const docRef = firebaseDb.collection('students').doc();
            newStudent.id = docRef.id;
            await withTimeout(docRef.set(newStudent), 8000, "Saving registration timed out. Please try again.");
            return { success: true, student: newStudent };
        } catch (err) {
            console.error("Firestore register error", err);
            return { error: "Database Error: " + err.message };
        }
    },


    // Step 2: Admin approves and generates credentials
    approveStudent: (id) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return null;
        }
        const students = AuthAPI.getAllStudents();
        const index = students.findIndex(s => s.id === id);

        if (index !== -1) {
            const student = { ...students[index] };
            if (student.status && student.status.toLowerCase() === 'pending') {
                student.status = 'approved';
                student.username = (student.firstName.charAt(0) + student.lastName).toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 100);
                student.password = Math.random().toString(36).slice(-8);

                firebaseDb.collection('students').doc(id).update({
                    status: student.status,
                    username: student.username,
                    password: student.password
                }).catch(err => {
                    console.error("Firestore approve error", err);
                    alert("Database Error: " + err.message);
                });
                return student;
            }
        }
        return null;
    },

    rejectStudent: (id) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return null;
        }
        const students = AuthAPI.getAllStudents();
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            const student = { ...students[index] };
            if (student.status && student.status.toLowerCase() === 'pending') {
                student.status = 'rejected';

                firebaseDb.collection('students').doc(id).update({
                    status: student.status
                }).catch(err => {
                    console.error("Firestore reject error", err);
                    alert("Database Error: " + err.message);
                });
                return student;
            }
        }
        return null;
    },

    deleteStudent: (id) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return false;
        }
        firebaseDb.collection('students').doc(id).delete().catch(err => console.error("Firestore delete student error", err));
        return true;
    },

    checkStatus: async (email) => {
        if (!isFirebaseInitialized || !firebaseDb) return null;
        try {
            const snapshotPromise = firebaseDb.collection('students')
                .where('email', '==', email)
                .get();
            const snapshot = await withTimeout(snapshotPromise, 8000, "Checking status timed out. Please try again.");
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
        } catch (e) {
            console.error("Firestore checkStatus error", e);
        }
        return null;
    },


    // Step 4: Answer submission and progress update (supports text, file uploads, and component index grading)
    submitAnswer: (userId, moduleId, question, answerText, fileData = null, componentIndex = null, extra = null) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        const students = AuthAPI.getAllStudents();
        const index = students.findIndex(s => s.id === userId);

        if (index !== -1) {
            const student = { ...students[index] };
            if (!student.answers) {
                student.answers = [];
            }

            // Match by componentIndex if provided, otherwise fallback to question + moduleId
            const existingIndex = student.answers.findIndex(a =>
                a.moduleId === moduleId &&
                (componentIndex !== null ? a.componentIndex === componentIndex : a.question === question)
            );

            let updatedAnswers = [...student.answers];

            const newAnswerObj = {
                moduleId,
                componentIndex: componentIndex !== null ? componentIndex : null,
                question: question || 'Reflection Question',
                answer: answerText !== undefined && answerText !== null ? answerText : '',
                file: fileData || null,
                date: new Date().toISOString(),
                type: extra && extra.type ? extra.type : (fileData ? 'file_upload' : 'reflection'),
                isCorrect: extra && extra.isCorrect !== undefined ? extra.isCorrect : null,
                score: extra && extra.score !== undefined ? extra.score : null,
                maxScore: extra && extra.maxScore !== undefined ? extra.maxScore : null
            };

            if (existingIndex !== -1) {
                const existing = { ...updatedAnswers[existingIndex] };
                if (answerText !== undefined && answerText !== null) {
                    existing.answer = answerText;
                }
                if (fileData) {
                    existing.file = fileData;
                }
                existing.date = new Date().toISOString();
                if (extra) {
                    if (extra.type) existing.type = extra.type;
                    if (extra.isCorrect !== undefined) existing.isCorrect = extra.isCorrect;
                    if (extra.score !== undefined) existing.score = extra.score;
                    if (extra.maxScore !== undefined) existing.maxScore = extra.maxScore;
                }
                updatedAnswers[existingIndex] = existing;
            } else {
                updatedAnswers.push(newAnswerObj);
            }

            student.answers = updatedAnswers;

            // Dynamic progress calculation based on unique modules completed relative to total modules
            const mods = AuthAPI.getModulesContent();
            const totalModules = Object.keys(mods).length || 1;
            const completedModuleIds = [...new Set(
                student.answers
                    .filter(a => a.type === 'lesson_completion')
                    .map(a => a.moduleId)
            )].filter(id => mods[id]);
            student.progress = Math.round(Math.min(100, (completedModuleIds.length / totalModules) * 100));

            firebaseDb.collection('students').doc(userId).update({
                answers: student.answers,
                progress: student.progress
            }).catch(err => {
                console.error("Firestore submit answer error", err);
                alert("Database Error: " + err.message);
            });

            // Update local session synchronously for quick local rendering
            const currentUser = AuthAPI.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(student));
            }
            return { success: true, newProgress: student.progress };
        }
        return { error: 'User not found' };
    },

    saveTeacherRemark: async (studentId, moduleId, componentIndex, remarkText, adminName) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        const students = AuthAPI.getAllStudents();
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            const student = { ...students[index] };
            if (!student.answers) student.answers = [];

            const ansIndex = student.answers.findIndex(a => a.moduleId === moduleId && a.componentIndex === componentIndex);
            if (ansIndex !== -1) {
                const ans = { ...student.answers[ansIndex] };
                ans.teacherRemarks = remarkText;
                ans.teacherRemarksDate = new Date().toISOString();
                ans.teacherRemarksAdmin = adminName || 'Admin';
                ans.remarksRead = false; // flag for student notification

                student.answers[ansIndex] = ans;

                await firebaseDb.collection('students').doc(studentId).update({
                    answers: student.answers
                });

                jilgmBroadcast('remarks_updated', { studentId, moduleId, componentIndex });
                return { success: true };
            }
        }
        return { error: 'Student or answer not found' };
    },

    saveGradeScore: async (studentId, moduleId, componentIndex, scoreVal) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        const students = AuthAPI.getAllStudents();
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            const student = { ...students[index] };
            if (!student.answers) student.answers = [];

            const ansIndex = student.answers.findIndex(a => a.moduleId === moduleId && a.componentIndex === componentIndex);
            if (ansIndex !== -1) {
                const ans = { ...student.answers[ansIndex] };
                ans.score = scoreVal;

                student.answers[ansIndex] = ans;

                await firebaseDb.collection('students').doc(studentId).update({
                    answers: student.answers
                });

                return { success: true };
            }
        }
        return { error: 'Student or answer not found' };
    },

    getUnreadRemarksCount: (studentId) => {
        const students = AuthAPI.getAllStudents();
        const student = students.find(s => s.id === studentId);
        if (student && student.answers) {
            return student.answers.filter(a => a.teacherRemarks && a.remarksRead === false).length;
        }
        return 0;
    },

    markRemarksAsRead: (studentId) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            return;
        }
        const students = AuthAPI.getAllStudents();
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            const student = { ...students[index] };
            if (student.answers) {
                let changed = false;
                student.answers = student.answers.map(a => {
                    if (a.teacherRemarks && a.remarksRead === false) {
                        changed = true;
                        return { ...a, remarksRead: true };
                    }
                    return a;
                });

                if (changed) {
                    firebaseDb.collection('students').doc(studentId).update({
                        answers: student.answers
                    }).catch(err => {
                        console.error("Firestore mark remarks read error", err);
                        alert("Database Error: " + err.message);
                    });

                    const currentUser = AuthAPI.getCurrentUser();
                    if (currentUser && currentUser.id === studentId) {
                        localStorage.setItem(SESSION_KEY, JSON.stringify(student));
                    }
                }
            }
        }
    },
    login: async (username, password, expectSitIn = false) => {
        if (!isFirebaseInitialized || !firebaseDb) return false;
        try {
            const snapshotPromise = firebaseDb.collection('students')
                .where('username', '==', username)
                .where('password', '==', password)
                .where('status', '==', 'approved')
                .get();
            const snapshot = await withTimeout(snapshotPromise, 8000, "Login timed out. Please try again.");
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const user = { id: doc.id, ...doc.data() };
                const isUserSitIn = !!user.isSitIn;
                if (isUserSitIn !== expectSitIn) {
                    return false;
                }
                localStorage.setItem(SESSION_KEY, JSON.stringify(user));
                return true;
            }
        } catch (e) {
            console.error("Firestore login error", e);
        }
        return false;
    },


    logout: () => {
        const user = AuthAPI.getCurrentUser();
        const isSitIn = user && user.isSitIn;
        localStorage.removeItem(SESSION_KEY);
        window.location.href = isSitIn ? 'sitin_login.html' : 'login.html';
    },

    getCurrentUser: () => {
        try {
            const user = localStorage.getItem(SESSION_KEY);
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error("Error parsing user session", e);
            return null;
        }
    },

    requireAuth: (expectSitIn = false) => {
        const user = AuthAPI.getCurrentUser();
        if (!user) {
            window.location.href = expectSitIn ? 'sitin_login.html' : 'login.html';
            return;
        }
        const students = AuthAPI.getAllStudents();
        const freshUser = students.find(s => s.id === user.id);
        if (!freshUser || !freshUser.status || freshUser.status.toLowerCase() !== 'approved') {
            AuthAPI.logout();
        }
    },

    getUnlockedModules: () => {
        try {
            const data = localStorage.getItem(UNLOCKED_KEY);
            return data ? JSON.parse(data) : ['module1'];
        } catch (e) {
            console.error("Error parsing unlocked modules list", e);
            return ['module1'];
        }
    },

    setModuleUnlocked: async (moduleId, isUnlocked) => {
        let unlocked = AuthAPI.getUnlockedModules();
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return unlocked;
        }
        if (isUnlocked) {
            if (!unlocked.includes(moduleId)) {
                unlocked.push(moduleId);
            }
        } else {
            unlocked = unlocked.filter(id => id !== moduleId);
        }

        await firebaseDb.collection('settings').doc('unlocked_modules').set({ list: unlocked });
        // Trigger recalculation for all students under Firestore
        const snapshot = await firebaseDb.collection('students').get();
        const batch = firebaseDb.batch();
        snapshot.forEach(doc => {
            const student = doc.data();
            const completedCount = unlocked.filter(modId =>
                (student.answers || []).some(a => a.moduleId === modId && a.type === 'lesson_completion')
            ).length;
            const progress = unlocked.length > 0 ? Math.round((completedCount / unlocked.length) * 100) : 0;
            batch.update(doc.ref, { progress });
        });
        await batch.commit();
        return unlocked;
    },

    isModuleUnlocked: (moduleId) => {
        const unlocked = AuthAPI.getUnlockedModules();
        return unlocked.includes(moduleId);
    },

    isModuleCompleted: (studentAnswers, moduleId) => {
        if (!studentAnswers) return false;
        return studentAnswers.some(a => a.moduleId === moduleId && a.type === 'lesson_completion');
    },

    getModulesContent: () => {
        try {
            const data = localStorage.getItem(CONTENT_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                    return parsed;
                }
            }
            return defaultModules;
        } catch (e) {
            console.error("Error parsing module content, falling back to defaultModules", e);
            return defaultModules;
        }
    },

    getModuleOrder: () => {
        try {
            const order = localStorage.getItem(ORDER_KEY);
            if (order) {
                const parsed = JSON.parse(order);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
            return Object.keys(AuthAPI.getModulesContent());
        } catch (e) {
            return Object.keys(AuthAPI.getModulesContent());
        }
    },

    saveModuleOrder: async (orderArray) => {
        localStorage.setItem(ORDER_KEY, JSON.stringify(orderArray));
        if (isFirebaseInitialized && firebaseDb) {
            await firebaseDb.collection('settings').doc('module_order').set({ list: orderArray });
        }
    },

    getModule: (moduleId) => {
        const mods = AuthAPI.getModulesContent();
        return mods[moduleId] || null;
    },

    saveModule: async (moduleId, title, subtitle, components) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return false;
        }
        await firebaseDb.collection('modules_content').doc(moduleId).set({
            title,
            subtitle,
            components
        });
        return true;
    },

    addModule: async (title, subtitle) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return null;
        }
        const newMod = {
            title: title || "New Module",
            subtitle: subtitle || "New Module Subtitle",
            components: [
                { type: 'header_h1', content: title || "New Module" },
                { type: 'text', content: "Welcome to this new module. Add some content here." }
            ]
        };

        const docRef = firebaseDb.collection('modules_content').doc();
        await docRef.set(newMod);

        let order = AuthAPI.getModuleOrder();
        if (!order.includes(docRef.id)) {
            order.push(docRef.id);
            await AuthAPI.saveModuleOrder(order);
        }
        return docRef.id;
    },

    getArchivedModules: () => {
        try {
            const data = localStorage.getItem(ARCHIVED_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error parsing archived modules list", e);
            return [];
        }
    },

    deleteModule: async (moduleId) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return false;
        }
        const mod = AuthAPI.getModule(moduleId);
        if (mod) {
            await firebaseDb.collection('modules_content').doc(moduleId).delete();
            await firebaseDb.collection('archived_modules').doc(moduleId).set({
                ...mod,
                archivedAt: new Date().toISOString()
            });

            // Also remove from unlocked list
            let unlocked = AuthAPI.getUnlockedModules();
            unlocked = unlocked.filter(id => id !== moduleId);
            await firebaseDb.collection('settings').doc('unlocked_modules').set({ list: unlocked });

            let order = AuthAPI.getModuleOrder();
            order = order.filter(id => id !== moduleId);
            await AuthAPI.saveModuleOrder(order);

            return true;
        }
        return false;
    },

    restoreModule: async (moduleId) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return false;
        }
        const doc = await firebaseDb.collection('archived_modules').doc(moduleId).get();
        if (doc.exists) {
            const modData = doc.data();
            const restoredMod = {
                title: modData.title,
                subtitle: modData.subtitle,
                components: modData.components
            };
            await firebaseDb.collection('modules_content').doc(moduleId).set(restoredMod);
            await firebaseDb.collection('archived_modules').doc(moduleId).delete();

            let order = AuthAPI.getModuleOrder();
            if (!order.includes(moduleId)) {
                order.push(moduleId);
                await AuthAPI.saveModuleOrder(order);
            }
            return true;
        }
        return false;
    },

    getAnnouncements: () => {
        try {
            const data = localStorage.getItem('jilgm_announcements');
            return data ? JSON.parse(data) : [
                {
                    id: 'announce_1',
                    title: 'Welcome to JILGM Leadership Masterclass!',
                    content: 'We are thrilled to welcome you to this premium cohort. Explore the first module "The Heart of a Leader" in your dashboard.',
                    date: new Date().toISOString()
                }
            ];
        } catch (e) {
            return [];
        }
    },

    addAnnouncement: (title, content) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return null;
        }
        const newAnn = {
            title,
            content,
            date: new Date().toISOString()
        };

        const docRef = firebaseDb.collection('announcements').doc();
        newAnn.id = docRef.id;
        docRef.set(newAnn).catch(err => console.error("Firestore add announcement error", err));
        return newAnn;
    },

    deleteAnnouncement: (id) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return false;
        }
        firebaseDb.collection('announcements').doc(id).delete().catch(err => console.error("Firestore delete announcement error", err));
        return true;
    },

    getResources: () => {
        try {
            const data = localStorage.getItem('jilgm_resources');
            return data ? JSON.parse(data) : [
                {
                    id: 'res_1',
                    name: 'Ezekiel 34 Study Guide',
                    type: 'pdf',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                },
                {
                    id: 'res_2',
                    name: 'Jesus as Shepherd Presentation',
                    type: 'ppt',
                    url: 'https://example.com/slides'
                }
            ];
        } catch (e) {
            return [];
        }
    },

    addResource: (name, type, url) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return null;
        }
        const newRes = {
            name,
            type,
            url
        };

        const docRef = firebaseDb.collection('resources').doc();
        newRes.id = docRef.id;
        docRef.set(newRes).catch(err => console.error("Firestore add resource error", err));
        return newRes;
    },

    deleteResource: (id) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return false;
        }
        firebaseDb.collection('resources').doc(id).delete().catch(err => console.error("Firestore delete resource error", err));
        return true;
    },

    getAdmins: () => {
        try {
            const data = localStorage.getItem('jilgm_admins');
            return data ? JSON.parse(data) : [{
                username: 'JILGM RiyadhRC',
                password: '061577D',
                isMain: true,
                displayName: 'JILGM RiyadhRC'
            }];
        } catch (e) {
            return [{
                username: 'JILGM RiyadhRC',
                password: '061577D',
                isMain: true,
                displayName: 'JILGM RiyadhRC'
            }];
        }
    },

    loginAdmin: (username, password) => {
        const admins = AuthAPI.getAdmins();
        const admin = admins.find(a => a.username === username && a.password === password);
        if (admin) {
            localStorage.setItem('jilgm_current_admin', JSON.stringify(admin));
            return true;
        }
        return false;
    },

    addAdmin: (username, password) => {
        return { error: 'Creating additional admin accounts is disabled.' };
    },

    deleteAdmin: (username) => {
        return { error: 'Deleting admin accounts is disabled.' };
    },

    getCurrentAdmin: () => {
        try {
            const admin = localStorage.getItem('jilgm_current_admin');
            const parsed = admin ? JSON.parse(admin) : null;
            if (parsed) {
                const uName = (parsed.username || '').toLowerCase();
                const roleVal = (parsed.ROLE || parsed.role || '').toLowerCase();
                const isValidAdmin = uName === 'jilgm riyadhrc' ||
                    uName === 'master_root' ||
                    uName === 'masterroot' ||
                    roleVal === 'master_root' ||
                    roleVal === 'masterroot' ||
                    parsed.isAdmin === true;

                if (!isValidAdmin) {
                    localStorage.removeItem('jilgm_current_admin');
                    return null;
                }
            }
            if (parsed) {
                const adminsCache = localStorage.getItem('jilgm_admins');
                if (adminsCache) {
                    const list = JSON.parse(adminsCache);
                    const fresh = list.find(a => a.username === parsed.username);
                    if (fresh) {
                        return { ...parsed, ...fresh };
                    }
                }
            }
            return parsed;
        } catch (e) {
            return null;
        }
    },

    updateAdminDisplayName: (newDisplayName) => {
        const admin = AuthAPI.getCurrentAdmin();
        if (!admin) return Promise.resolve({ error: 'Not authenticated as admin' });

        admin.displayName = newDisplayName;
        localStorage.setItem('jilgm_current_admin', JSON.stringify(admin));

        // Update list cache
        const data = localStorage.getItem('jilgm_admins');
        if (data) {
            const list = JSON.parse(data);
            const idx = list.findIndex(a => a.username === 'JILGM RiyadhRC');
            if (idx !== -1) {
                list[idx].displayName = newDisplayName;
                localStorage.setItem('jilgm_admins', JSON.stringify(list));
            }
        }

        triggerStorageSync('jilgm_current_admin');
        triggerStorageSync('jilgm_admins');

        if (isFirebaseInitialized && firebaseDb) {
            return firebaseDb.collection('admins').doc('JILGM RiyadhRC').update({
                displayName: newDisplayName
            }).then(() => ({ success: true }))
                .catch(err => {
                    console.error("Firestore update admin display name error", err);
                    return { error: err.message };
                });
        }
        return Promise.resolve({ success: true });
    },

    logoutAdmin: () => {
        localStorage.removeItem('jilgm_current_admin');
        window.location.href = 'admin_login.html';
    },

    requireAdminAuth: () => {
        const admin = AuthAPI.getCurrentAdmin();
        if (!admin) {
            window.location.href = 'admin_login.html';
        }
    },

    getInstructors: () => {
        if (window.liveInstructors && window.liveInstructors.length > 0) {
            return window.liveInstructors;
        }
        try {
            const data = localStorage.getItem('jilgm_instructors');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    addInstructor: (name, username, password, outreach = "") => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        const list = AuthAPI.getInstructors();
        if (list.some(i => i.username === username)) {
            return { error: 'Username already exists.' };
        }
        const newInst = {
            id: 'inst_' + Date.now(),
            name,
            username,
            password,
            outreach,
            dateAdded: new Date().toISOString()
        };

        firebaseDb.collection('instructors').doc(newInst.id).set(newInst).catch(err => console.error("Firestore add instructor error", err));
        return { success: true, instructor: newInst };
    },

    deleteInstructor: (id) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            alert('Database is offline or not configured. Operation blocked.');
            return false;
        }
        firebaseDb.collection('instructors').doc(id).delete().catch(err => console.error("Firestore delete instructor error", err));
        return true;
    },

    loginInstructor: async (username, password) => {
        if (!isFirebaseInitialized || !firebaseDb) return false;
        try {
            const snapshotPromise = firebaseDb.collection('instructors')
                .where('username', '==', username)
                .where('password', '==', password)
                .get();
            const snapshot = await withTimeout(snapshotPromise, 8000, "Login timed out. Please try again.");
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const inst = { id: doc.id, ...doc.data() };
                localStorage.setItem('jilgm_current_instructor', JSON.stringify(inst));
                return true;
            }
        } catch (e) {
            console.error("Firestore loginInstructor error", e);
        }
        return false;
    },

    getCurrentInstructor: () => {
        try {
            const inst = localStorage.getItem('jilgm_current_instructor');
            return inst ? JSON.parse(inst) : null;
        } catch (e) {
            return null;
        }
    },

    logoutInstructor: () => {
        localStorage.removeItem('jilgm_current_instructor');
        window.location.href = 'instructor_login.html';
    },

    requireInstructorAuth: () => {
        const inst = AuthAPI.getCurrentInstructor();
        if (!inst) {
            window.location.href = 'instructor_login.html';
        }
    },

    requireAdminOrInstructorAuth: () => {
        const admin = AuthAPI.getCurrentAdmin();
        const inst = AuthAPI.getCurrentInstructor();
        if (!admin && !inst) {
            window.location.href = 'admin_login.html';
        }
    },

    updateInstructorOutreach: async (id, outreach) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        try {
            await firebaseDb.collection('instructors').doc(id).update({ outreach });
            return { success: true };
        } catch (e) {
            console.error("Firestore update instructor outreach error", e);
            return { error: e.message };
        }
    },

    updateInstructorName: async (id, name) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        try {
            await firebaseDb.collection('instructors').doc(id).update({ name });
            return { success: true };
        } catch (e) {
            console.error("Firestore update instructor name error", e);
            return { error: e.message };
        }
    },

    updateInstructorUsername: async (id, username) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        try {
            const list = AuthAPI.getInstructors();
            const exists = list.some(inst => inst.username.toLowerCase() === username.toLowerCase() && inst.id !== id);
            if (exists) {
                return { error: 'Username is already taken by another instructor.' };
            }
            await firebaseDb.collection('instructors').doc(id).update({ username });
            return { success: true };
        } catch (e) {
            console.error("Firestore update instructor username error", e);
            return { error: e.message };
        }
    },

    updateInstructorPassword: async (id, password) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        try {
            await firebaseDb.collection('instructors').doc(id).update({ password });
            return { success: true };
        } catch (e) {
            console.error("Firestore update instructor password error", e);
            return { error: e.message };
        }
    },

    updateStudentOutreach: async (id, outreach) => {
        if (!isFirebaseInitialized || !firebaseDb) {
            return { error: 'Database is offline or not configured. Operation blocked.' };
        }
        try {
            await firebaseDb.collection('students').doc(id).update({ outreach });

            // Sync local student session if updating currently logged-in student
            const currentUser = AuthAPI.getCurrentUser();
            if (currentUser && currentUser.id === id) {
                const students = AuthAPI.getAllStudents();
                const freshUser = students.find(s => s.id === id);
                if (freshUser) {
                    localStorage.setItem('jilgm_current_user', JSON.stringify({ ...freshUser, outreach }));
                }
            }
            return { success: true };
        } catch (e) {
            console.error("Firestore update student outreach error", e);
            return { error: e.message };
        }
    },

    askQuestion: async (studentId, moduleId, questionText) => {
        if (!isFirebaseInitialized || !firebaseDb) return { error: 'Database is offline' };
        try {
            const students = AuthAPI.getAllStudents();
            const index = students.findIndex(s => s.id === studentId);
            if (index !== -1) {
                const student = { ...students[index] };
                if (!student.questions) student.questions = [];

                const newQuestion = {
                    id: 'q_' + Date.now(),
                    moduleId,
                    question: questionText,
                    date: new Date().toISOString(),
                    replies: []
                };

                student.questions.push(newQuestion);

                await firebaseDb.collection('students').doc(studentId).update({
                    questions: student.questions
                });

                // Update local session synchronously if current student
                const currentUser = AuthAPI.getCurrentUser();
                if (currentUser && currentUser.id === studentId) {
                    localStorage.setItem(SESSION_KEY, JSON.stringify(student));
                }
                return { success: true, question: newQuestion };
            }
        } catch (e) {
            console.error("Firestore askQuestion error", e);
            return { error: e.message };
        }
        return { error: 'Student not found' };
    },

    replyToQuestion: async (studentId, questionId, replyText, replierName) => {
        if (!isFirebaseInitialized || !firebaseDb) return { error: 'Database offline' };
        try {
            const students = AuthAPI.getAllStudents();
            const index = students.findIndex(s => s.id === studentId);
            if (index !== -1) {
                const student = { ...students[index] };
                if (!student.questions) student.questions = [];

                const qIndex = student.questions.findIndex(q => q.id === questionId);
                if (qIndex !== -1) {
                    const question = { ...student.questions[qIndex] };
                    if (!question.replies) question.replies = [];

                    question.replies.push({
                        senderName: replierName,
                        message: replyText,
                        date: new Date().toISOString()
                    });

                    student.questions[qIndex] = question;

                    await firebaseDb.collection('students').doc(studentId).update({
                        questions: student.questions
                    });
                    return { success: true };
                }
            }
        } catch (e) {
            console.error("Firestore replyToQuestion error", e);
            return { error: e.message };
        }
        return { error: 'Student or question not found' };
    },

    sendChatMessage: async (studentId, messageText, senderId, senderName) => {
        if (!isFirebaseInitialized || !firebaseDb) return { error: 'Database offline' };
        try {
            const students = AuthAPI.getAllStudents();
            const index = students.findIndex(s => s.id === studentId);
            if (index !== -1) {
                const student = { ...students[index] };
                if (!student.chatMessages) student.chatMessages = [];

                const newMessage = {
                    id: 'msg_' + Date.now(),
                    senderId,
                    senderName,
                    message: messageText,
                    date: new Date().toISOString(),
                    readByStudent: senderId === studentId,
                    readByInstructor: senderId !== studentId
                };

                student.chatMessages.push(newMessage);

                await firebaseDb.collection('students').doc(studentId).update({
                    chatMessages: student.chatMessages
                });

                // Update local session synchronously if current student
                const currentUser = AuthAPI.getCurrentUser();
                if (currentUser && currentUser.id === studentId) {
                    localStorage.setItem(SESSION_KEY, JSON.stringify(student));
                }
                return { success: true, message: newMessage };
            }
        } catch (e) {
            console.error("Firestore sendChatMessage error", e);
            return { error: e.message };
        }
        return { error: 'Student not found' };
    },

    markChatAsRead: async (studentId, role) => {
        if (!isFirebaseInitialized || !firebaseDb) return;
        try {
            const students = AuthAPI.getAllStudents();
            const index = students.findIndex(s => s.id === studentId);
            if (index !== -1) {
                const student = { ...students[index] };
                if (student.chatMessages && student.chatMessages.length > 0) {
                    let changed = false;
                    student.chatMessages = student.chatMessages.map(msg => {
                        if (role === 'student' && !msg.readByStudent) {
                            msg.readByStudent = true;
                            changed = true;
                        } else if (role === 'instructor' && !msg.readByInstructor) {
                            msg.readByInstructor = true;
                            changed = true;
                        }
                        return msg;
                    });

                    if (changed) {
                        await firebaseDb.collection('students').doc(studentId).update({
                            chatMessages: student.chatMessages
                        });

                        const currentUser = AuthAPI.getCurrentUser();
                        if (currentUser && currentUser.id === studentId) {
                            localStorage.setItem(SESSION_KEY, JSON.stringify(student));
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Firestore markChatAsRead error", e);
        }
    }
};

window.AuthAPI = AuthAPI;
window.defaultModules = defaultModules;

