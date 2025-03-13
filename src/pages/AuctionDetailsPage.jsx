import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Clock, 
  Loader2,
  Package,
  DollarSign,
  Users,
  Calendar,
  ShoppingBag,
  MapPin,
  ClipboardCheck,
  ArrowLeft,
  Award
} from 'lucide-react';

const AuctionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      setIsLoading(true);
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock auction data
        const mockAuction = {
          id: parseInt(id),
          title: 'Premium Flue-Cured Virginia Tobacco',
          description: 'High-quality flue-cured tobacco with exceptional flavor profile, perfect for premium blends. This batch features golden-yellow leaves with excellent texture and elasticity, ideal for premium cigarette production.',
          current_price: 350.00,
          starting_price: 250.00,
          reserve_price: 400.00,
          min_bid_increment: 5.00,
          bids_count: 8,
          tobacco_type: 'flue_cured',
          quantity: '500kg',
          grade: 'Premium',
          region_grown: 'Virginia, USA',
          season_grown: '2024 Summer',
          seller: {
            id: 2,
            name: 'Virginia Farms Ltd',
            rating: 4.8,
            total_sales: 156
          },
          created_at: '2025-03-10T14:00:00',
          start_time: '2025-03-10T15:00:00',
          ends_at: '2025-03-15T18:00:00',
          status: 'active',
          images: [
            'https://via.placeholder.com/800x500',
            'https://via.placeholder.com/800x500',
            'https://via.placeholder.com/800x500'
          ],
          timb_certificate: 'TIMB-2025-000345',
          timb_cleared: true,
          timb_cleared_at: '2025-03-08T09:30:00'
        };
        
        // Mock bids data
        const mockBids = [
          {
            id: 1,
            auction_id: parseInt(id),
            user_id: 5,
            user_name: 'Global Tobacco Inc.',
            amount: 350.00,
            is_winning: true,
            created_at: '2025-03-12T16:45:22'
          },
          {
            id: 2,
            auction_id: parseInt(id),
            user_id: 8,
            user_name: 'Premier Leaf Buyers',
            amount: 335.50,
            is_winning: false,
            created_at: '2025-03-12T14:32:10'
          },
          {
            id: 3,
            auction_id: parseInt(id),
            user_id: 12,
            user_name: 'EastWest Trading Co.',
            amount: 310.25,
            is_winning: false,
            created_at: '2025-03-11T09:18:45'
          },
          {
            id: 4,
            auction_id: parseInt(id),
            user_id: 5,
            user_name: 'Global Tobacco Inc.',
            amount: 300.00,
            is_winning: false,
            created_at: '2025-03-11T07:56:32'
          },
          {
            id: 5,
            auction_id: parseInt(id),
            user_id: 19,
            user_name: 'Leaf Processors Ltd.',
            amount: 280.00,
            is_winning: false,
            created_at: '2025-03-10T21:14:09'
          },
          {
            id: 6,
            auction_id: parseInt(id),
            user_id: 8,
            user_name: 'Premier Leaf Buyers',
            amount: 265.00,
            is_winning: false,
            created_at: '2025-03-10T18:05:55'
          },
          {
            id: 7,
            auction_id: parseInt(id),
            user_id: 12,
            user_name: 'EastWest Trading Co.',
            amount: 255.00,
            is_winning: false,
            created_at: '2025-03-10T16:22:40'
          },
          {
            id: 8,
            auction_id: parseInt(id),
            user_id: 5,
            user_name: 'Global Tobacco Inc.',
            amount: 250.00,
            is_winning: false,
            created_at: '2025-03-10T15:10:18'
          }
        ];
        
        setAuction(mockAuction);
        setBids(mockBids);
        
        // Set initial bid amount suggestion
        if (mockAuction.current_price) {
          setBidAmount((mockAuction.current_price + mockAuction.min_bid_increment).toFixed(2));
        }
      } catch (error) {
        console.error('Error fetching auction details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuctionDetails();
  }, [id]);

  // Format time remaining
  const getTimeRemaining = (endTime) => {
    const total = new Date(endTime) - new Date();
    
    if (total <= 0) {
      return 'Auction ended';
    }
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    // Validate bid amount
    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= auction.current_price) {
      setBidError(`Bid must be greater than current price of $${auction.current_price.toFixed(2)}`);
      return;
    }
    
    if (bidValue < auction.current_price + auction.min_bid_increment) {
      setBidError(`Minimum bid increment is $${auction.min_bid_increment.toFixed(2)}`);
      return;
    }
    
    setBidError('');
    setIsBidding(true);
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new mock bid
      const newBid = {
        id: bids.length + 1,
        auction_id: auction.id,
        user_id: user.id,
        user_name: user.name,
        amount: bidValue,
        is_winning: true,
        created_at: new Date().toISOString()
      };
      
      // Update previous winning bid
      const updatedBids = bids.map(bid => ({
        ...bid,
        is_winning: false
      }));
      
      // Add new bid to the beginning of the list
      setBids([newBid, ...updatedBids]);
      
      // Update auction current price
      setAuction({
        ...auction,
        current_price: bidValue,
        bids_count: auction.bids_count + 1
      });
      
      // Set next bid suggestion
      setBidAmount((bidValue + auction.min_bid_increment).toFixed(2));
      
      // Show success message (in a real app, you would use a toast or notification system)
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError('Failed to place bid. Please try again.');
    } finally {
      setIsBidding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Auction not found</h3>
        <p className="text-muted-foreground mt-2">The auction you're looking for doesn't exist or has been removed</p>
        <Button className="mt-6" onClick={() => navigate('/auctions')}>
          Back to Auctions
        </Button>
      </div>
    );
  }

  // Calculate time remaining
  const timeRemaining = getTimeRemaining(auction.ends_at);
  const isEnded = timeRemaining === 'Auction ended';
  
  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Button 
          variant="ghost" 
          className="mb-4 -ml-2"
          onClick={() => navigate('/auctions')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">{auction.title}</h1>
        <div className="mt-2 flex items-center text-muted-foreground">
          <ClipboardCheck className="mr-2 h-4 w-4" />
          <span>TIMB Certificate: {auction.timb_certificate}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main image */}
          <div className="overflow-hidden rounded-lg border border-border">
            <img 
              src={auction.images[0]} 
              alt={auction.title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Thumbnail images */}
          <div className="flex gap-4">
            {auction.images.slice(1).map((image, index) => (
              <div 
                key={index} 
                className="w-24 h-24 overflow-hidden rounded-md border border-border"
              >
                <img 
                  src={image} 
                  alt={`${auction.title} - Image ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Product details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                {auction.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                <div className="flex items-start gap-2">
                  <Package className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Type</p>
                    <p className="text-muted-foreground capitalize">{auction.tobacco_type.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Quantity</p>
                    <p className="text-muted-foreground">{auction.quantity}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Award className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Grade</p>
                    <p className="text-muted-foreground">{auction.grade}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Region</p>
                    <p className="text-muted-foreground">{auction.region_grown}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Season</p>
                    <p className="text-muted-foreground">{auction.season_grown}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Seller</p>
                    <p className="text-muted-foreground">{auction.seller.name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Bid history */}
          <Card>
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
              <CardDescription>
                {auction.bids_count} bids placed in this auction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 divide-y divide-border">
                {bids.map((bid) => (
                  <div key={bid.id} className="pt-4 first:pt-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {bid.user_name}
                          {bid.is_winning && (
                            <span className="ml-2 text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary/10 text-primary">
                              Current Leader
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bid.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${bid.is_winning ? 'text-primary' : ''}`}>
                          ${bid.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Auction details and bid form */}
        <div className="space-y-6">
          {/* Auction info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Auction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current price */}
              <div>
                <p className="text-sm text-muted-foreground">Current Bid</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-primary">
                    ${auction.current_price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Started at ${auction.starting_price.toFixed(2)}
                  </p>
                </div>
              </div>
              
              {/* Auction timer */}
              <div className="bg-accent/80 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <p className="font-medium">
                    {isEnded ? 'Auction Ended' : 'Time Remaining'}
                  </p>
                </div>
                <p className="text-2xl font-bold">
                  {timeRemaining}
                </p>
              </div>
              
              {/* Place bid form */}
              {user?.user_type === 'buyer' && !isEnded && (
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bidAmount">Your Bid</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="bidAmount"
                        type="number"
                        step="0.01"
                        min={(auction.current_price + auction.min_bid_increment).toFixed(2)}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="pl-8"
                        placeholder="Enter your bid amount"
                      />
                    </div>
                    {bidError && (
                      <p className="text-sm text-destructive">{bidError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Minimum bid: ${(auction.current_price + auction.min_bid_increment).toFixed(2)}
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isBidding}
                  >
                    {isBidding ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Bid...
                      </>
                    ) : 'Place Bid'}
                  </Button>
                </form>
              )}
              
              {/* Auction ended message */}
              {isEnded && (
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="font-medium">This auction has ended</p>
                  {bids.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Winning bid: ${bids[0].amount.toFixed(2)} by {bids[0].user_name}
                    </p>
                  )}
                </div>
              )}
              
              {/* Only show for buyer and if auction has ended with winning bid */}
              {isEnded && bids.length > 0 && bids[0].user_id === user?.id && user?.user_type === 'buyer' && (
                <Button className="w-full">
                  Complete Purchase
                </Button>
              )}
              
              {/* Auction management for seller */}
              {user?.user_type === 'trader' && auction.seller.id === user.id && (
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    Edit Auction
                  </Button>
                  
                  {!isEnded && (
                    <Button 
                      variant="destructive" 
                      className="w-full"
                    >
                      Cancel Auction
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Seller info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>About the Seller</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {auction.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{auction.seller.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {auction.seller.total_sales} Sales • {auction.seller.rating} Rating
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full text-sm">
                  View Seller Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailsPage;