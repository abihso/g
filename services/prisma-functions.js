import  {prisma}  from "../config/db.js"
export const createNewMember = async (payloadData) => {
  const newMember = await prisma.user.create({
    data : {
      fname : payloadData.fname,
      lname : payloadData.lname,
      address : payloadData.address,
      school : payloadData.school,
      dob : payloadData.dob,
      gender : payloadData.gender,
      email : payloadData.email,
      number : payloadData.number,
      img : payloadData.img,
      password : payloadData.password,
      memberpin : payloadData.memberpin,
      status : "member"
    }
  })
  return newMember
}

export const createMessage = async (payloadData) => {
  const newMessage = await prisma.message.create({
    data: {
      title: payloadData.title,
      message: payloadData.message,
      by: payloadData.by
    }
  })
  return newMessage
}

export const getMessages = async () => {
  const messages = await prisma.message.findMany()
  return messages
}
export const getMessage = async (id) => {
  const message = await prisma.message.findMany({
    where: {
      id
    }
  })
  return message
}
export const removeMessage = async (id) => { 
  await prisma.message.delete({
    where : { id : Number(id) }
  })
}
export const createNewAdmin = async (payloadData) => {
  const newAdmin = await prisma.user.create({
    data: {
      fname : payloadData.fname,
      lname : payloadData.lname,
      address : payloadData.address,
      school : payloadData.school,
      dob : payloadData.dob,
      gender : payloadData.gender,
      email : payloadData.email,
      number : payloadData.number,
      img : payloadData.img,
      password : payloadData.password,
      memberpin : payloadData.memberpin,
      status : "admin"
    }
  })
  return newAdmin
}

export const getMembers = async () => {
  const members = await prisma.user.findMany({
    where: { status: "member" }
  }).then(users => {
    return users.map(user => {
      return {
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        number: user.number,
        img: user.img,
        memberpin: user.memberpin
      }
    })
  })
  return members
}

export const getSingleMember = async (id) => {
  const member = await prisma.user.findUnique({  
    where: { memberpin: id }
  })
  return member
}

export const updateMember = async (id, payloadData) => {
  await prisma.user.update({
    where: { memberpin: id },
    data: {
      fname: String(payloadData.fname),
      lname: String(payloadData.lname),
      address: String(payloadData.address),
      school: String(payloadData.school),
      dob: String(payloadData.dob),
      gender: String(payloadData.gender),
      email: String(payloadData.email),
      number: String(payloadData.number),
    }
  }, 
    
  )
}
export const removeMember = async (id) => {
  await prisma.user.delete({
    where : { memberpin : id }
  })
}

export const registerBenefit = async (payloadData) => {
  const newBenefit = await prisma.benefit.create({
    data : {
      fname : payloadData.fname,
      lname : payloadData.lname,
      address : payloadData.address,
      saddress : payloadData.saddress,
      pschool : payloadData.pschool,
      cschool : payloadData.cschool,
      date : payloadData.date,
      email : payloadData.email,
      applicant_number : payloadData.applicant_number,
      head_number : payloadData.head_number,
      benefit : payloadData.benefit,
      oldpayslip : payloadData.oldpayslip,
      currentpayslip : payloadData.currentpayslip,
      supportdocuments : payloadData.supportdocuments,
      supportdocument : payloadData.supportdocument,
      memberpin: payloadData.memberpin,
      approved_by: "Not Yet",
      status : "Pending"
     }
  })
  return newBenefit
}
export const adminRegisterBenefit = async (payloadData) => {
  const newBenefit = await prisma.benefit.create({
    data : {
      fname : payloadData.fname,
      lname : payloadData.lname,
      address : payloadData.address,
      saddress : payloadData.saddress,
      pschool : payloadData.pschool,
      cschool : payloadData.cschool,
      date : payloadData.date,
      email : payloadData.email,
      head_number : payloadData.head_number,
      benefit : payloadData.benefit,
      oldpayslip : payloadData.oldpayslip,
      currentpayslip : payloadData.currentpayslip,
      supportdocuments : payloadData.supportdocuments,
      memberpin: payloadData.memberpin,
      approved_by: "Not Yet",
      status : "Pending"
     }
  })
  return newBenefit
}

export const verifyClaim = async (benefit, memberpin) => {
  try {
    const records = await prisma.benefit.findMany({
      where: {
        memberpin,
        benefit
      },
    })

    return records

  } catch (error) {
  }
}

export const getAllSpecificApplications = async (column, value) => {
  let infor;
  if (column == "status") {
      infor = await prisma.benefit.findMany({
        where: {
              status : value
            }
      })
     return infor
  }
  else if (column == "approved_by") {
      infor = await prisma.benefit.findMany({
        where: {
              approved_by : value
            }
      })
      return infor
  } else if (column == "memberpin") {
      infor = await prisma.benefit.findMany({
        where: {
              memberpin : value
            }
      })
      return infor
  }
  else {
    return []
  }
 
}
export const getAllSpecificApplicationsByUser = async (status, memberpin) => {
  let infor;
      infor = await prisma.benefit.findMany({
        where: {
          AND: [
            {
              status
            },
            {
              memberpin 
            }
          ]
        }
      })
     return infor 
}

export const getAllApplications = async() => {
  const infor = await prisma.benefit.findMany()
  return infor
}
export const getAllApplicationsByMember = async( memberpin ) => {
  const infor = await prisma.benefit.findMany({
    where: {
      memberpin
    }
  })
  return infor
}
export const getSingleApplication = async (id) => {
  const infor = await prisma.benefit.findUnique({
    where: {
      id 
    }
  })
  return infor
}

export const searchMember = async (value) => {
  const infor = await prisma.user.findMany({
    where: {
      OR: [
        {fname: {
        startsWith : value
      }},
      {lname: {
        startsWith : value
      }},
      {memberpin: {
        startsWith : value
      }}
      ]
    }
  })
  return infor
}

export const searchBenefit = async (value) => {
  const infor = await prisma.benefit.findMany({
    where: {
      OR: [
            {
              fname: {
            startsWith : value
            }
            },
            {
              lname: {
              startsWith : value
            }
            },
            {
              memberpin: {
              startsWith : value
            }
            }
      ]
    }
  })
  return infor
}

export const updatePassword = async (password, memberpin) => {
  const updateRecord = await prisma.user.update({
    where: {
      memberpin
    },
    data: {
      password
    }
  })
  return updateRecord
}

export const updateRecord = async (id, status, approved_by) => {
  const updateInfor = await prisma.benefit.update({
    where: {
      id
    },
    data: {
      status,
      approved_by
    }
  })
  return updateInfor
}

export const pay = async (memberpin, approved_by,benefit) => {
  const updateInfor = await prisma.benefit.update({
    where: {
      AND: [
        {
          memberpin
        },
        {
          benefit
        }
      ]
    },
    data: {
      status : "Claimed",
      approved_by
    }
  })
  return updateInfor
}