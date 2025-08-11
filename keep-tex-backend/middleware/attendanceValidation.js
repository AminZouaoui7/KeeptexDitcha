const normalizeStatus = (req, res, next) => {
  if (req.body.status) {
    // Convert to lowercase and remove accents
    let status = req.body.status.toLowerCase();
    
    // Map common variations to standard values
    const statusMap = {
      'present': 'present',
      'absent': 'absent',
      'conge': 'conge',
      'présent': 'present',
      'absente': 'absent',
      'congé': 'conge',
      'vacances': 'conge',
      'holiday': 'conge',
      'off': 'conge'
    };
    
    const normalizedStatus = statusMap[status] || status;
    
    // Validate against allowed values
    const allowedStatuses = ['present', 'absent', 'conge'];
    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${req.body.status}. Allowed values: present, absent, conge`
      });
    }
    
    req.body.status = normalizedStatus;
  }
  
  next();
};

module.exports = { normalizeStatus };