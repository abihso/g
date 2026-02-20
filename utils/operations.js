import db from "../db/db.js";
  db.exec(`
    create table if not exists member (
      id integer primary key autoincrement,
      fname varchar(30) not null, 
      lname varchar(40) not null,
      address varchar(40) not null,
      school varchar(70) not null,
      dob varchar(50) not null,
      gender varchar(7) not null,
      email varchar(100) not null,
      number varchar(15) not null,
      img varchar(100) not null, 
      password varchar(150) not null,
      memberpin varchar(10) not null unique,
      status varchar(10) default 'member'
)`)
  db.exec(`
    create table if not exists message (
      id integer primary key autoincrement,
      title varchar(200) not null,
      message varchar(200) not null,
      by varchar(200) not null
)`)
  db.exec(`
    create table if not exists benefit (
      id integer primary key autoincrement,
      fname varchar(30) not null, 
      lname varchar(40) not null,
      address varchar(40) not null,
      saddress varchar(40) not null,
      pschool varchar(70) not null,
      cschool varchar(70) not null,
      date varchar(50) not null,
      email varchar(100) not null,
      applicant_number varchar(15),
      head_number varchar(15) not null,
      benefit varchar(150) not null,
      oldpayslip varchar(150) not null,
      currentpayslip varchar(150) not null,
      supportdocuments varchar(150),
      memberpin varchar(10) not null,
      approved_by varchar(150) default 'not yet',
      status varchar(10) default 'pending'
)`)
// export const createMessage = (data) => {
// return db.prepare(`insert into message(title,message,by) values(?,?,?)`).run([data.title, data.message, data.by])
// }
// export const getMessages = () => {
//   return db.prepare("select * from message").all()
// }
// export const removeMessage = (id) => {
//   db.prepare("delete from message where id = ?").run([String(id)])
// }
// export const createNewMember = (data) => {
// return db.prepare(`insert into member(fname,lname,address,school,dob,gender,email,number,img,password,memberpin) values(?,?,?,?,?,?,?,?,?,?,?)`).run([data.fname, data.lname, data.address, data.school, data.dob, data.gender, data.email, data.number, data.img, data.password, data.memberpin])
// }
// export const createNewAdmin = (data) => {
//   return db.prepare(`insert into member(fname,lname,address,school,dob,gender,email,number,img,password,memberpin,status) values(?,?,?,?,?,?,?,?,?,?,?,?)`).run([data.fname, data.lname, data.address, data.school, data.dob, data.gender, data.email, data.number, data.img, data.password, data.memberpin, data.status])
// }
// export const getMembers = () => {
//   return db.prepare("select * from member where status='member'").all()
  
// }
// export const getSingleMember = (id) => {
//   return db.prepare("select * from member where memberpin = ?").get(id)
// }
// export const updateMember = (id,data) => {
//   db.prepare("update member set fname = ?,lname = ?,address = ?,school = ? ,dob = ? ,gender = ?,email = ?,number = ? where memberpin = ?").run([String(data.fname), String(data.lname), String(data.address),String( data.school),String( data.dob), String(data.gender), String(data.email), String(data.number), String(id)])
// }
// export const removeMember = (id) => {
//   db.prepare("delete from member where memberpin = ?").run([String(id)])
// }
// export const registerBenefit = (data) => {
//   return db.prepare(`insert into benefit(
//       fname,
//       lname,
//       address,
//       saddress,
//       pschool,
//       cschool,
//       date,
//       email,
//       applicant_number,
//       head_number,
//       benefit,
//       oldpayslip,
//       currentpayslip,
//       supportdocuments,
//       memberpin
//     ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
//     `).run([
//       String(data.fname),String(data.lname),String(data.address),String(data.saddress),String(data.pschool),String(data.cschool),String(data.dob),String(data.email),String(data.number),String(data.TelHeadteacher),String(data.benefit),String(data.oldpayslip),String(data.currentpayslip),String(data.supportdocuments),String(data.memberpin)
//     ])
  
// }
// export const adminRegisterBenefit = (data) => {
//   return db.prepare(`insert into benefit(
//       fname,
//       lname,
//       address,
//       saddress,
//       pschool,
//       cschool,
//       date,
//       email,
//       head_number,
//       benefit,
//       oldpayslip,
//       currentpayslip,
//       supportdocuments,
//       memberpin,
//       applicant_number
//     ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
//     `).run([
//       String(data.fname),String(data.lname),String(data.address),String(data.saddress),String(data.pschool),String(data.cschool),String(data.dob),String(data.email),String(data.number),String(data.benefit),String(data.oldpayslip),String(data.currentpayslip),String(data.supportdocuments),String(data.memberpin),String(data.applicant_number)
//     ])
  
// }
// export const getMemberApplication = (id) => {
//   return db.prepare("select * from benefit where memberpin = ?").all(String(id))
// }
// export const getSingleApplication = (id) => {
//   return db.prepare("select * from benefit where id = ?").all(String(id))
// }
// export const getAllSpecificApplications = (column, value) => {
//   return db.prepare(`select * from benefit where ${column} = ?`).all([String(value)])
//   }
// export const getAllApplications = ( ) => {
//   return db.prepare(`select * from benefit `).all()
// }
// export const updateRecord = (id, value, approved_by) => {
//   return db.prepare("update benefit set status = ?, approved_by = ? where id = ?").run([String(value),String(approved_by),String(id)])
// }
// export const pay = (id, approved_by,benefit) => {
//   return db.prepare("update benefit set status = ?, approved_by = ? where memberpin = ? and benefit = ? ").run(["claimed",String(approved_by),String(id),String(benefit)])
// }
// export const verifyClaim = (benefit,pin) => {
//   return db.prepare("select * from benefit where benefit = ? and memberpin = ?").all([String(benefit),String(pin)])
// }
// export const updatePassword = (password, id) => {
//   return db.prepare("update member set password = ? where memberpin = ?").run([password,id])
// }
// export const getAllSpecificUserApplications = (column, value,memberpin) => {
//   return db.prepare(`select * from benefit where ${column} = ? and memberpin = ?`).all([String(value),String(memberpin)])
// }
// export const searchMember = (value) => {
//   return db.prepare(`select * from member where fname like '${value}%' or lname like '${value}%' or memberpin like '${value}%'`).all()
// }
// export const searchBenefit = (value) => {
//   return db.prepare(`select * from benefit where fname like '${value}%' or lname like '${value}%' or memberpin like '${value}%'`).all()
// }