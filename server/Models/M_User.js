const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ufollowerSch = new Schema({
    flID: { type: Number, ref: 'Users' },
    flAt: Date
});

const tfollowerSch = new Schema({
    flID: { type: Number, ref: 'Users' },
    flAt: Date
});

const subscribeSch = new Schema({
    flID: { type: Number, ref: 'Groups' },
    flAt: Date
});

const friendSch = new Schema({
    frID: { type: Number, ref: 'Users' },
    st: Number, // pending 0, accepted 1, decline 2, blocked 3,
    on: Date,
});


const GrpAdmSch = new Schema({
    gpID: { type: Number },
    ty: { type: String, enum: ['allies', 'baddies', 'classmates', 'hobby', 'friends', 'gang'], required: true }, //type
    sub: Number, //0 for 6 months and 1 for 12 months //subscription
    on: Date, //created on date and time
});

const rqstSch = new Schema({
    rID: { type: Number },
    ty: { type: Number, required: true }, //'friend', 'page', 'event', 'follow'
    uID: { type: Number, ref: 'Users' }, 
    sID: { type: Number, ref: 'Page' },
    on: Date,
});

const privSch = new Schema({
    prv: Boolean,
    set: String,
    val: String,
    on: Date
});

const UeduSch = new Schema({
    qal: String, //qualification - need relation
    ins: String, //institut - need relation
    des: String, //description - need relation
    fm: Date,
    to: Date,
    gin: Boolean,
    lok: Boolean,
    on: Date
});

const UwrkSch = new Schema({
    qal: String, //need relation
    ins: String, //need relation
    abt: String, 
    des: String, //need relation
    fm: Date,
    to: Date,
    gin: Boolean,
    lok: Boolean,
    on: Date
});

const UeventSch = new Schema({
    ach: String, //need relation
    ins: String, //need relation
    pin: Boolean,
    abt: String, 
    gin: Boolean,
    lok: Boolean,
    on: Date
});

const UlivSch = new Schema({
    loc: String,
    ty: String,
    abt: String,
    fm: Date,
    to: Date,    
    lk: Boolean
});

const userNotificationSch = new Schema({
    mg: String,
    ty: Number, //acceptance, like, comment, report, 
    rd: Number, //delivered, received, seen
    on: Date
});
const groupNotificationSch = new Schema({
    mg: String,
    ty: Number, //acceptance, like, comment, report, 
    rd: Number, //delivered, received, seen
    on: Date
});

const blockUserSch = new Schema({
    blID: { type: Number, ref: 'Users' },
    blAt: Date //date an time at which the user has blocked another user 
});

const blockGrpSch = new Schema({
    blID: { type: Number, ref: 'Groups' },
    blAt: Date //date an time at which the user has blocked a group 
});

const suspSch = new Schema({
    ty: { type: String, enum: ['sGroup', 'sPost', 'sComment'], required: true }, //type
    msg: String,
    fm: Date, //start of the suspension time
    to: Date, // end of the suspension time
    on: Date //date an time at which the user got suspended for a type of reason
});

const savePostSch = new Schema({
    pID: { type: Number, ref: 'Post' },
    on: Date
});

const ADSch = new Schema({
    tl: { type: String, required: true },
    stl: { type: String, required: true },
    txt: { type: String, required: true },
    tag: [{ type: String, required: true }], 
    img: { type: String },
    typ: { type: Number, required: true }, //'Scroll', 'Caro', '3', '4', '5', '6', '7', '8', '9', '10'
    usr: { type: String, age: Number, rgi: String },
});


const RQSch = new Schema({
    uID: { type: String, required: true },
    ty: { type: String, required: true },
    dc: { type: String, required: true },
});

const userSch = new Schema({
    uID: { type: Number, index: true },
    unm: { type: String, required: true }, //username
    fnm: { type: String, required: true }, //firstname
    mnm: { type: String, required: true }, //middlename
    lnm: { type: String, required: true }, //lastname
    nik: { type: String }, //nickname
    eml: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    psw: { type: String, required: true },
    mob: { type: Number, required: true, unique: true, match: /^\d{10}$/ },
    dob: { type: Date, required: true },
    uFL: [ufollowerSch], // list of users followed by the user
    tFL: [tfollowerSch], // list of users the user is following
    uSB: [subscribeSch], // list of groups subscribed by the user
    FRN: [friendSch],
    GPS: [GrpAdmSch], //group list where this user is the admin
    RQ: [RQSch], //Requests 
    prv: [privSch], //privacy type
    abt: [{
        edu: [UeduSch],
        liv: [UlivSch],
        wrk: [UwrkSch],
        ach: [UeventSch]
    }],
    cPh: { type: Number, required: true }, //cell phone number
    NTF: [userNotificationSch], //must have only 20 items at a time
    gNTF: [groupNotificationSch], //notifications from created groups & subscribed groups - must have only 30 items at a time
    blU: [blockUserSch], //blocked users by the user
    blG: [blockGrpSch], //blocked groups by user
    svP: [savePostSch], 
    sus: [suspSch], //suspension
    rqs: [rqstSch], //requests 
    e_nm: Date, //name edited date and time
    pDP: Boolean, //personal DP
    aDP: Boolean, //affiliation DP
    cDP: Boolean, //cover DP
    h_m: Boolean, //mobile privacy
    h_e: Boolean, //email privacy
    str: Date, //join/start date and time
    stt: { type: Number, default: 0 }, //current user status - fine, suspension, deletion, deleted, deactivation, verified, unverified
    AD: [ADSch], //Ads schema
    DC: { type: Number, default: 0 },
    on: Date // user registered date and time
}, { uID: false });

userSch.plugin(AutoIncrement, { id: 'user_seq', inc_field: 'uID', start_seq: 1024 });
module.exports = mongoose.model('Users', userSch);
