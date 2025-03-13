import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Clock, Plus, Search, Filter, Loader2 } from 'lucide-react';

const AuctionsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockAuctions = [
          { 
            id: 1, 
            title: 'Premium Flue-Cured Virginia Tobacco', 
            description: 'High-quality flue-cured tobacco with exceptional flavor profile, perfect for premium blends.',
            current_price: 350.00, 
            starting_price: 250.00,
            bids_count: 8,
            tobacco_type: 'flue_cured',
            quantity: '500kg',
            grade: 'Premium',
            seller: 'Virginia Farms Ltd',
            created_at: '2025-03-10T14:00:00',
            ends_at: '2025-03-15T18:00:00',
            status: 'active',
            image: 'https://via.placeholder.com/300x200'
          },
          { 
            id: 2, 
            title: 'Organic Burley Tobacco Batch #FB284', 
            description: 'Certified organic burley tobacco, grown without pesticides. Medium nicotine content.',
            current_price: 280.50, 
            starting_price: 200.00,
            bids_count: 5,
            tobacco_type: 'burley',
            quantity: '320kg',
            grade: 'A',
            seller: 'Organic Leaf Co',
            created_at: '2025-03-11T10:30:00',
            ends_at: '2025-03-16T14:30:00',
            status: 'active',
            image: 'https://via.placeholder.com/300x200'
          },
          { 
            id: 3, 
            title: 'Dark Fired Kentucky Tobacco', 
            description: 'Traditional dark-fired tobacco with strong smoky flavor, ideal for pipe blends and snuff.',
            current_price: 420.75, 
            starting_price: 350.00,
            bids_count: 12,
            tobacco_type: 'dark_fired',
            quantity: '275kg',
            grade: 'Premium',
            seller: 'Kentucky Leaf Holdings',
            created_at: '2025-03-09T16:45:00',
            ends_at: '2025-03-14T09:45:00',
            status: 'ending_soon',
            image: 'https://via.placeholder.com/300x200'
          },
          { 
            id: 4, 
            title: 'Premium Oriental Tobacco', 
            description: 'Aromatic oriental tobacco with unique spicy notes, perfect for specialty cigarette blends.',
            current_price: 385.25, 
            starting_price: 300.00,
            bids_count: 7,
            tobacco_type: 'oriental',
            quantity: '180kg',
            grade: 'A+',
            seller: 'Anatolia Tobacco Traders',
            created_at: '2025-03-10T09:15:00',
            ends_at: '2025-03-14T21:15:00',
            status: 'active',
            image: 'https://via.placeholder.com/300x200'
          },
          { 
            id: 5, 
            title: 'Shade-Grown Connecticut Wrapper Leaf', 
            description: 'Fine, silky wrapper leaves grown under shade. Excellent elasticity and neutral flavor.',
            current_price: 520.00, 
            starting_price: 450.00,
            bids_count: 9,
            tobacco_type: 'connecticut',
            quantity: '150kg',
            grade: 'Premium',
            seller: 'Connecticut Valley Farms',
            created_at: '2025-03-08T12:00:00',
            ends_at: '2025-03-18T12:00:00',
            status: 'active',
            image: 'https://via.placeholder.com/300x200'
          },
          { 
            id: 6, 
            title: 'Organic Sun-Cured Oriental Blend', 
            description: 'Naturally sun-cured oriental varieties, offering a mild and aromatic smoke.',
            current_price: 310.25, 
            starting_price: 250.00,
            bids_count: 4,
            tobacco_type: 'oriental',
            quantity: '220kg',
            grade: 'B+',
            seller: 'Sun Leaf Organics',
            created_at: '2025-03-12T11:30:00',
            ends_at: '2025-03-17T15:00:00',
            status: 'active',
            image: 'https://via.placeholder.com/300x200'
          },
        ];
        
        setAuctions(mockAuctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuctions();
  }, []);

  // Filter and sort auctions
  const filteredAuctions = auctions
    .filter(auction => {
      // Filter by search term
      const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by type
      const matchesType = filterType === 'all' || auction.tobacco_type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortBy) {
        case 'price_asc':
          return a.current_price - b.current_price;
        case 'price_desc':
          return b.current_price - a.current_price;
        case 'ending_soon':
          return new Date(a.ends_at) - new Date(b.ends_at);
        case 'most_bids':
          return b.bids_count - a.bids_count;
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  // Format time remaining
  const getTimeRemaining = (endTime) => {
    const total = new Date(endTime) - new Date();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hr${hours > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'Ending soon';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tobacco Auctions</h1>
        <p className="text-muted-foreground">
          Browse current tobacco listings and place your bids.
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search auctions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-1 gap-4">
          <div className="w-full md:w-1/3">
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span>Tobacco Type</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flue_cured">Flue Cured</SelectItem>
                <SelectItem value="burley">Burley</SelectItem>
                <SelectItem value="dark_fired">Dark Fired</SelectItem>
                <SelectItem value="oriental">Oriental</SelectItem>
                <SelectItem value="connecticut">Connecticut</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/3">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full">
                <span>Sort By</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
                <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                <SelectItem value="most_bids">Most Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {user?.user_type === 'trader' && (
          <Button className="md:w-auto gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            <span>New Auction</span>
          </Button>
        )}
      </div>
      
      {/* Auctions grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading auctions...</p>
          </div>
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No auctions found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <Card key={auction.id} className="flex flex-col overflow-hidden border-border">
              <div className="relative h-48 bg-muted">
                <img 
                  src={auction.image} 
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${auction.status === 'ending_soon' 
                      ? 'bg-amber-500/90 text-amber-50' 
                      : 'bg-emerald-500/90 text-emerald-50'}`
                  }>
                    {auction.status === 'ending_soon' ? 'Ending Soon' : 'Active'}
                  </div>
                </div>
              </div>
              
              <CardContent className="flex-1 pt-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg leading-tight">{auction.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Bid</p>
                    <p className="font-bold text-primary">${auction.current_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bids</p>
                    <p>{auction.bids_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="capitalize">{auction.tobacco_type.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p>{auction.quantity}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Ends in {getTimeRemaining(auction.ends_at)}</span>
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-4">
                <div className="w-full flex gap-3">
                  <Button 
                    variant="outline" 
                    className="w-1/2" 
                    asChild
                  >
                    <Link to={`/auctions/${auction.id}`}>View Details</Link>
                  </Button>
                  
                  {user?.user_type === 'buyer' && (
                    <Button className="w-1/2">Place Bid</Button>
                  )}
                  
                  {user?.user_type === 'trader' && user.id === auction.seller_id && (
                    <Button className="w-1/2">Manage</Button>
                  )}
                  
                  {user?.user_type === 'timb_officer' && (
                    <Button className="w-1/2">Review</Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionsPage;