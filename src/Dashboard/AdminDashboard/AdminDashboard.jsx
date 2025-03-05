import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Switch,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [leadsToAdd, setLeadsToAdd] = useState('');
  const [filters, setFilters] = useState({
    searchQuery: '',
    month: '',
    industry: '',
    service: ''
  });
  const [allIndustries, setAllIndustries] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
            setLoading(true);

      const [vendorsResponse, buyersResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/lead/getAllVendors`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/lead/getAllBuyers`)
      ]);

      if (vendorsResponse.data.vendors) {
        setVendors(vendorsResponse.data.vendors.map(vendor => {
          const matchedBuyers = vendor.matchedBuyers || [];
          const acceptedBuyers = matchedBuyers.filter(mb => mb.status === 'accepted').length;
          const rejectedBuyers = matchedBuyers.filter(mb => mb.status === 'rejected').length;
          const pendingBuyers = matchedBuyers.filter(mb => !mb.status || mb.status === 'pending').length;

          return {
            ...vendor,
            matchedBuyers,
            leads: vendor.leads || 0,
            stats: {
              acceptedBuyers,
              rejectedBuyers,
              pendingBuyers,
              totalMatches: matchedBuyers.length
            }
          };
        }));
      }

      if (buyersResponse.data.buyers) {
        setBuyers(buyersResponse.data.buyers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
 } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type, item) => {
    setDialogType(type);
    setSelectedItem(item);
    setDialogOpen(true);
  };
  const [buyerDialog, setBuyerDialog] = useState('')
  const [buyerData, setBuyerData] = useState()
  const [buyerDialogopen, setBuyerDialogOpen] = useState('false')
  const handleBuyerDialog = (type, item) => {
    setBuyerDialog(type)
    setBuyerData(item)
    setBuyerDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setLeadsToAdd('');
    setBuyerDialogOpen(false);
  };

  const renderBuyerDialog = () => {
    if (!buyerData) return null;

    const data = buyerData.buyer;
    const matchedVendors = buyerData.matchedVendors || [];
    const acceptedVendors = matchedVendors.filter(v => v.status === 'accepted');
    const rejectedVendors = matchedVendors.filter(v => v.status === 'rejected');
    const pendingVendors = matchedVendors.filter(v => !v.status || v.status === 'pending');

    return (
      <Dialog
        open={buyerDialogopen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
            color: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Buyer Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Paper spacing={3} sx={{ background: '#444', mt: 2, color: '#fff', p: 2 }} >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Company Name:</strong> {data.companyName}</Typography>
                  <Typography><strong>Contact:</strong> {`${data.firstName} ${data.lastName}`}</Typography>
                  <Typography><strong>Email:</strong> {data.email}</Typography>
                  <Typography><strong>Website:</strong> {data.companyWebsite}</Typography>
                  <Typography><strong>Company Size:</strong> {data.companySize}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Industries:</strong></Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {data.industries.map((industry) => (
                      <Chip key={industry} label={industry} size="small" color='secondary' />
                    ))}
                  </Box>
                  <Typography><strong>Services:</strong></Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {data.services.map((service) => (
                      <Chip key={service.service} label={service.service} size="small" color='primary' />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Match Statistics
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{
                    p: 3,
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(75, 95, 75, 0.1), rgba(92, 92, 92, 0.05))',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#81c784' }}>
                      Vendor Status
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        borderRadius: 1
                      }}>
                        <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Accepted Vendors</Typography>
                        <Chip
                          size="medium"
                          label={acceptedVendors.length}
                          color="success"
                          sx={{ minWidth: 60 }}
                        />
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                        borderRadius: 1
                      }}>
                        <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Rejected Vendors</Typography>
                        <Chip
                          size="medium"
                          label={rejectedVendors.length}
                          color="error"
                          sx={{ minWidth: 60 }}
                        />
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 1
                      }}>
                        <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Pending Vendors</Typography>
                        <Chip
                          size="medium"
                          label={pendingVendors.length}
                          sx={{ minWidth: 60, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 8, mb: 2 }}>
                Matched Vendors Details
              </Typography>
              <TableContainer component={Paper} sx={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(121, 121, 121, 0.05))',
                border: '1px solid rgba(25, 118, 210, 0.2)',
                borderRadius: 2,
              }}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#fff' }}>Company Name</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Contact Person</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Matched Industries</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Matched Services</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {matchedVendors.map((match, index) => {
                      const matchedIndustries = data.industries.filter(industry =>
                        match.vendor?.selectedIndustries?.includes(industry)
                      );

                      const matchedServices = data.services.map(s => s.service).filter(service =>
                        match.vendor?.selectedServices?.includes(service)
                      );

                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ color: '#fff' }}>
                            <Typography variant="body2">
                              {match.vendor?.companyName || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Typography variant="body2">
                              {`${match.vendor?.firstName} ${match.vendor?.lastName}` || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Typography variant="body2">
                              {match.vendor?.email}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {matchedIndustries.map((industry, i) => (
                                <Chip
                                  key={i}
                                  label={industry}
                                  size="small"
                                  color="primary"
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {matchedServices.map((service, i) => (
                                <Chip
                                  key={i}
                                  label={service}
                                  size="small"
                                  color="secondary"
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Chip
                              size="small"
                              label={match.status || 'Pending'}
                              color={
                                match.status === 'accepted' ? 'success'
                                  : match.status === 'rejected' ? 'error'
                                    : 'default'
                              }
                              sx={{ minWidth: 80 }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };
  const handleAddLeads = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lead/addLeads/${selectedItem.vendor.email}`, {
        leads: parseInt(leadsToAdd)
      });
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding leads:', error);
    }
  };

  const handleToggleActivation = async (email) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/toggle-activation/${email}`);
      
      if (response.data) {
        // Refresh the data to show updated activation status
        await fetchData();
      }
    } catch (error) {
      console.error('Error toggling activation:', error);
      // You might want to show an error message to the user here
    }
  };
  
  const renderDetailsDialog = () => {
    if (!selectedItem) return null;

    console.log('selected vendor', selectedItem)

    const isVendor = dialogType === 'vendor';
    const data = isVendor ? selectedItem.vendor : selectedItem;

    // Calculate accepted and rejected buyers from the matchedBuyers array
    const matchedBuyers = selectedItem.vendor.matchedBuyers || [];
    const acceptedBuyers = matchedBuyers.filter(b => b.status === 'accepted');
    const rejectedBuyers = matchedBuyers.filter(b => b.status === 'rejected');
    const pendingBuyers = matchedBuyers.filter(b => !b.status || b.status === 'pending');

    // Calculate lead usage rate based on accepted buyers
    const totalLeads = data.leads || 0;
    const usedLeads = acceptedBuyers.length;
    const leadUsageRate = totalLeads === 0 || usedLeads >= totalLeads ? 100 : ((usedLeads / totalLeads) * 100).toFixed(1);

    return (
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
            color: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {isVendor ? 'Vendor Details' : 'Buyer Details'}
          </Typography>
          {isVendor && (
            <Chip
              label={`${leadUsageRate}% Leads Used`}
              color={leadUsageRate > 80 ? 'error' : leadUsageRate > 50 ? 'warning' : 'success'}
              size="small"
              sx={{ ml: 'auto' }}
            />
          )}
        </DialogTitle>
        <DialogContent>

          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Paper spacing={3} sx={{ background: '#444', mt: 2, color: '#fff', p: 2 }} >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Company Name:</strong> {data.companyName}</Typography>
                  <Typography><strong>Contact:</strong> {`${data.firstName} ${data.lastName}`}</Typography>
                  <Typography><strong>Email:</strong> {data.email}</Typography>
                  {isVendor && (
                    <Typography><strong>Phone:</strong> {data.phone}</Typography>
                  )}
                  <Typography><strong>Website:</strong> {data.companyWebsite}</Typography>
                  {!isVendor && (
                    <Typography><strong>Company Size:</strong> {data.companySize}</Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Industries:</strong></Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {(isVendor ? data.selectedIndustries : data.industries).map((industry) => (
                      <Chip key={industry} label={industry} size="small" color='secondary' />
                    ))}
                  </Box>
                  <Typography><strong>Services:</strong></Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(isVendor ? data.selectedServices : data.services.map(s => s.service)).map((service) => (
                      <Chip key={service} label={service} size="small" color='primary' />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {isVendor && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Lead Management
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{
                      p: 3,
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(121, 121, 121, 0.05))',
                      border: '1px solid rgba(25, 118, 210, 0.2)',
                      borderRadius: 2
                    }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#90caf9' }}>
                        Lead Statistics
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Available Leads</Typography>
                          <Typography variant="h6" color='primary'>{totalLeads}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Used Leads</Typography>
                          <Typography variant="h6" color='primary'>{usedLeads}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Total Matched Buyers</Typography>
                          <Typography variant="h6" color='primary'>{matchedBuyers.length}</Typography>
                        </Box>
                        <Box sx={{
                          mt: 1,
                          pt: 2,
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Lead Usage Rate</Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: leadUsageRate > 80 ? '#ff5252' : leadUsageRate > 50 ? '#ffab40' : '#69f0ae'
                            }}
                          >
                            {leadUsageRate}%
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{
                      p: 3,
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(84, 100, 85, 0.1), rgba(99, 99, 99, 0.05))',
                      border: '1px solid rgba(76, 175, 80, 0.2)',
                      borderRadius: 2
                    }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#81c784' }}>
                        Buyer Status
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          borderRadius: 1
                        }}>
                          <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Accepted Buyers</Typography>
                          <Chip
                            size="medium"
                            label={acceptedBuyers.length}
                            color="success"
                            sx={{ minWidth: 60 }}
                          />
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                          borderRadius: 1
                        }}>
                          <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Rejected Buyers</Typography>
                          <Chip
                            size="medium"
                            label={rejectedBuyers.length}
                            color="error"
                            sx={{ minWidth: 60 }}
                          />
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 1
                        }}>
                          <Typography sx={{ color: 'rgb(255, 255, 255)' }}>Pending Buyers</Typography>
                          <Chip
                            size="medium"
                            label={pendingBuyers.length}
                            sx={{ minWidth: 60, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Matched Buyers Details
                </Typography>
                <TableContainer component={Paper} sx={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(121, 121, 121, 0.05))',
                  border: '1px solid rgba(25, 118, 210, 0.2)',
                  borderRadius: 2,
                }}>
                  <Table size="medium" sx={{ border: '1px solid #fff' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#fff' }}>Company Name</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Contact Person</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Matched Industries</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Matched Services</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {matchedBuyers.map((match, index) => {
                        // Find common industries
                        const matchedIndustries = data.selectedIndustries.filter(industry =>
                          match.buyer?.industries?.includes(industry)
                        );

                        // Find common services
                        const matchedServices = data.selectedServices.filter(service =>
                          match.buyer?.services?.some(s => s.service === service)
                        );

                        return (
                          <TableRow key={index}>
                            <TableCell sx={{ color: '#fff' }}>
                              <Typography variant="body2">
                                {match.companyName || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              <Typography variant="body2">
                                {match.buyerName || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              <Typography variant="body2">
                                {match.buyerEmail}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {matchedIndustries.map((industry, i) => (
                                  <Chip
                                    key={i}
                                    label={industry}
                                    size="small"
                                    color="primary"
                                  />
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {matchedServices.map((service, i) => (
                                  <Chip
                                    key={i}
                                    label={service}
                                    size="small"
                                    color="secondary"
                                  />
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              <Chip
                                size="small"
                                label={match.status || 'Pending'}
                                color={
                                  match.status === 'accepted' ? 'success'
                                    : match.status === 'rejected' ? 'error'
                                      : 'default'
                                }
                                sx={{ minWidth: 80, color: '#fff' }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAddLeadsDialog = () => {
    if (!selectedItem) return null;

    return (
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add Leads for {selectedItem.vendor.companyName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Number of Leads"
            type="number"
            fullWidth
            value={leadsToAdd}
            onChange={(e) => setLeadsToAdd(e.target.value)}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddLeads} variant="contained" color="primary">
            Add Leads
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const collectFiltersData = (vendors, buyers) => {
    const industries = new Set();
    const services = new Set();

    vendors.forEach(vendor => {
      vendor.vendor.selectedIndustries.forEach(industry => industries.add(industry));
      vendor.vendor.selectedServices.forEach(service => services.add(service));
    });

    buyers.forEach(buyer => {
      buyer.buyer.industries.forEach(industry => industries.add(industry));
      buyer.buyer.services.forEach(service => services.add(service.service));
    });

    setAllIndustries(Array.from(industries));
    setAllServices(Array.from(services));
  };

  const filterData = (data, type) => {
    return data.filter(item => {
      const itemData = type === 'vendor' ? item.vendor : item.buyer;
      const name = `${itemData.firstName} ${itemData.lastName}`.toLowerCase();
      const company = itemData.companyName.toLowerCase();
      const searchQuery = filters.searchQuery.toLowerCase();

      const matchesSearch = !filters.searchQuery ||
        name.includes(searchQuery) ||
        company.includes(searchQuery);

      const matchesIndustry = !filters.industry ||
        (type === 'vendor'
          ? itemData.selectedIndustries.includes(filters.industry)
          : itemData.industries.includes(filters.industry));

      const matchesService = !filters.service ||
        (type === 'vendor'
          ? itemData.selectedServices.includes(filters.service)
          : itemData.services.some(s => s.service === filters.service));

      const matchesMonth = !filters.month ||
        new Date(itemData.createdAt).getMonth() === parseInt(filters.month);

      return matchesSearch && matchesIndustry && matchesService && matchesMonth;
    });
  };

  const FilterControls = () => (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Month</InputLabel>
            <Select
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                }
              }}
            >
              <MenuItem value="">All Months</MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            options={allIndustries}
            value={filters.industry}
            onChange={(_, newValue) => setFilters(prev => ({ ...prev, industry: newValue }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by Industry"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            )}
            sx={{
              '& .MuiAutocomplete-input': { color: '#fff' }
            }}
            disablePortal
            blurOnSelect
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            options={allServices}
            value={filters.service}
            onChange={(_, newValue) => setFilters(prev => ({ ...prev, service: newValue }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by Service"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            )}
            sx={{
              '& .MuiAutocomplete-input': { color: '#fff' }
            }}
            disablePortal
            blurOnSelect
          />
        </Grid>
      </Grid>
    </Box>
  );

  const exportToCSV = (data, type) => {
    const csvData = data.map(item => {
      const itemData = type === 'vendor' ? item.vendor : item.buyer;
      return {
        'Company Name': itemData.companyName,
        'Contact Person': `${itemData.firstName} ${itemData.lastName}`,
        'Email': itemData.email,
        'Created Date': new Date(itemData.createdAt).toLocaleDateString(),
        ...(type === 'vendor' ? {
          'Available Leads': itemData.leads || 0,
          'Matched Buyers': itemData.matchedBuyers?.length || 0,
          'Industries': itemData.selectedIndustries.join(', '),
          'Services': itemData.selectedServices.join(', ')
        } : {
          'Company Size': itemData.companySize,
          'Industries': itemData.industries.join(', '),
          'Services': itemData.services.map(s => s.service).join(', '),
          'Matched Vendors': itemData.matchedVendors?.length || 0
        })
      };
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_data_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };
if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <CircularProgress sx={{ color: '#4998F8' }} />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Vendors</Typography>
              <Typography variant="h3">{vendors.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(45deg, #FF4081 30%, #FF79B0 90%)',
            color: 'white',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Buyers</Typography>
              <Typography variant="h3">{buyers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
            color: 'white',
            boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Matches</Typography>
              <Typography variant="h3">
                {vendors.reduce((sum, vendor) => sum + (vendor.matchedBuyers?.length || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(45deg, #03A9F4 30%, #00BCD4 90%)',
            color: 'white',
            boxShadow: '0 3px 5px 2px rgba(3, 169, 244, .3)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Leads</Typography>
              <Typography variant="h3">
                {vendors.reduce((sum, vendor) => sum + (vendor.vendor.leads || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <FilterControls />
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Vendors" sx={{ color: '#fff' }} />
          <Tab label="Buyers" sx={{ color: '#fff' }} />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(121, 121, 121, 0.05))',
              border: '1px solid rgba(25, 118, 210, 0.2)',
              borderRadius: 2,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                    Vendors Overview
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => exportToCSV(vendors, 'vendor')}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white'
                    }}
                  >
                    Export CSV
                  </Button>
                </Box>
                <TableContainer component={Paper} sx={{
                  borderRadius: 2, boxShadow: 3,
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(121, 121, 121, 0.05))',
                  border: '1px solid rgba(25, 118, 210, 0.2)',
                  borderRadius: 2,
                }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Company Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Contact Person</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Available Leads</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Matched Buyers</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterData(vendors, 'vendor').map((vendorData) => (
                        <TableRow key={vendorData.vendor._id}>
                          <TableCell sx={{ color: '#fff' }}>{vendorData.vendor.companyName}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{`${vendorData.vendor.firstName} ${vendorData.vendor.lastName}`}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{vendorData.vendor.email}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {vendorData.vendor.leads || 0}
                              <Tooltip title="Add Leads">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog('addLeads', vendorData)}
                                >
                                  <AddCircleIcon sx={{ color: '#fff' }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>{vendorData.vendor.matchedBuyers?.length || 0}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog('vendor', vendorData)}
                                >
                                  <VisibilityIcon sx={{ color: '#fff' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Toggle Activation">
                                <Switch
                                  size="small"
                                  checked={vendorData.vendor.active || false}
                                  onChange={() => handleToggleActivation(vendorData.vendor.email)}
                                  color="primary"
                                />
                              </Tooltip>

                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(121, 121, 121, 0.05))',
              border: '1px solid rgba(25, 118, 210, 0.2)',
              borderRadius: 2,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                    Buyers Overview
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => exportToCSV(buyers, 'buyer')}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white'
                    }}
                  >
                    Export CSV
                  </Button>
                </Box>
                <TableContainer component={Paper} sx={{
                  borderRadius: 2, boxShadow: 3,
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(121, 121, 121, 0.05))',
                  border: '1px solid rgba(25, 118, 210, 0.2)',
                  borderRadius: 2,
                }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#fff' }}>Company Name</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Contact Person</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Company Size</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Matched Vendors</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterData(buyers, 'buyer').map((buyerData) => (
                        <TableRow key={buyerData.buyer._id}>
                          <TableCell sx={{ color: '#fff' }}>{buyerData.buyer.companyName}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            {`${buyerData.buyer.firstName} ${buyerData.buyer.lastName}`}
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>{buyerData.buyer.email}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{buyerData.buyer.companySize}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{buyerData.matchedVendors.length}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleBuyerDialog('buyer', buyerData)}
                                >
                                  <VisibilityIcon sx={{ color: '#fff' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Toggle Activation">
                                <Switch
                                  size="small"
                                  checked={buyerData.buyer.active || false}
                                  onChange={() => handleToggleActivation(buyerData.buyer.email)}
                                  color="primary"
                                />
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {dialogType === 'addLeads' ? renderAddLeadsDialog() : renderDetailsDialog()}
      {buyerDialogopen === true && renderBuyerDialog()}

    </Container>
  );
};

export default AdminDashboard;
