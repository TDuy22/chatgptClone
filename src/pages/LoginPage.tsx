import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LuEye, LuEyeOff, LuMail, LuLock } from 'react-icons/lu';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    
    // Hardcoded login check for admin
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === 'admin') {
        localStorage.setItem('askify_user', JSON.stringify({ email }));
        setIsLoading(false);
        navigate('/app');
      } else {
        setError('Tài khoản hoặc mật khẩu không đúng');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <Box 
      minH='100vh' 
      bg='gray.950' 
      display='flex' 
      alignItems='center' 
      justifyContent='center'
      position='relative'
      overflow='hidden'
    >
      {/* Background Effects */}
      <Box
        position='absolute'
        top='-200px'
        left='-200px'
        w='500px'
        h='500px'
        bg='radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)'
        pointerEvents='none'
      />
      <Box
        position='absolute'
        bottom='-200px'
        right='-200px'
        w='500px'
        h='500px'
        bg='radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
        pointerEvents='none'
      />

      <Container maxW='md' position='relative'>
        <VStack gap='8'>
          {/* Logo */}
          <VStack gap='4' cursor='pointer' onClick={() => navigate('/')}>
            <Image
              src='/askify-logo.png'
              alt='Askify Logo'
              h='60px'
              objectFit='contain'
            />
            <Heading
              size='xl'
              bgGradient='to-r'
              gradientFrom='blue.400'
              gradientTo='purple.400'
              bgClip='text'
            >
              Askify
            </Heading>
          </VStack>

          {/* Login Form */}
          <Box
            w='full'
            bg='rgba(255, 255, 255, 0.03)'
            border='1px solid'
            borderColor='rgba(255, 255, 255, 0.1)'
            borderRadius='2xl'
            p='8'
            backdropFilter='blur(20px)'
          >
            <VStack gap='6' as='form' onSubmit={handleLogin}>
              <VStack gap='2' textAlign='center' w='full'>
                <Heading size='lg' color='white'>
                  Đăng nhập
                </Heading>
                <Text color='gray.400'>
                  Chào mừng bạn quay lại Askify
                </Text>
              </VStack>

              {/* Error Message */}
              {error && (
                <Box
                  w='full'
                  bg='rgba(239, 68, 68, 0.1)'
                  border='1px solid'
                  borderColor='rgba(239, 68, 68, 0.3)'
                  borderRadius='lg'
                  p='3'
                >
                  <Text color='red.400' fontSize='sm' textAlign='center'>
                    {error}
                  </Text>
                </Box>
              )}

              {/* Email Input */}
              <VStack w='full' align='start' gap='2'>
                <Text color='gray.300' fontSize='sm' fontWeight='medium'>
                  Email / Tên đăng nhập
                </Text>
                <Box position='relative' w='full'>
                  <Box
                    position='absolute'
                    left='4'
                    top='50%'
                    transform='translateY(-50%)'
                    color='gray.500'
                  >
                    <LuMail />
                  </Box>
                  <Input
                    type='text'
                    placeholder='admin'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    pl='12'
                    h='12'
                    bg='rgba(255, 255, 255, 0.05)'
                    border='1px solid'
                    borderColor='rgba(255, 255, 255, 0.1)'
                    borderRadius='lg'
                    color='white'
                    _placeholder={{ color: 'gray.500' }}
                    _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px rgba(14, 165, 233, 0.5)',
                    }}
                  />
                </Box>
              </VStack>

              {/* Password Input */}
              <VStack w='full' align='start' gap='2'>
                <HStack w='full' justify='space-between'>
                  <Text color='gray.300' fontSize='sm' fontWeight='medium'>
                    Mật khẩu
                  </Text>
                  <Text
                    color='blue.400'
                    fontSize='sm'
                    cursor='pointer'
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Quên mật khẩu?
                  </Text>
                </HStack>
                <Box position='relative' w='full'>
                  <Box
                    position='absolute'
                    left='4'
                    top='50%'
                    transform='translateY(-50%)'
                    color='gray.500'
                  >
                    <LuLock />
                  </Box>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    pl='12'
                    pr='12'
                    h='12'
                    bg='rgba(255, 255, 255, 0.05)'
                    border='1px solid'
                    borderColor='rgba(255, 255, 255, 0.1)'
                    borderRadius='lg'
                    color='white'
                    _placeholder={{ color: 'gray.500' }}
                    _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px rgba(14, 165, 233, 0.5)',
                    }}
                  />
                  <Box
                    position='absolute'
                    right='4'
                    top='50%'
                    transform='translateY(-50%)'
                    color='gray.500'
                    cursor='pointer'
                    onClick={() => setShowPassword(!showPassword)}
                    _hover={{ color: 'gray.300' }}
                  >
                    {showPassword ? <LuEyeOff /> : <LuEye />}
                  </Box>
                </Box>
              </VStack>

              {/* Login Button */}
              <Button
                type='submit'
                w='full'
                h='12'
                bg='linear-gradient(135deg, #0ea5e9, #8b5cf6)'
                color='white'
                fontSize='md'
                fontWeight='semibold'
                borderRadius='lg'
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 40px rgba(14, 165, 233, 0.4)',
                }}
                _active={{ transform: 'translateY(0)' }}
                transition='all 0.2s'
                loading={isLoading}
                loadingText='Đang đăng nhập...'
              >
                Đăng nhập
              </Button>

              {/* Divider */}
              <HStack w='full' gap='4'>
                <Box flex='1' h='1px' bg='rgba(255, 255, 255, 0.1)' />
                <Text color='gray.500' fontSize='sm'>hoặc</Text>
                <Box flex='1' h='1px' bg='rgba(255, 255, 255, 0.1)' />
              </HStack>

              {/* Social Login */}
              <Button
                w='full'
                h='12'
                variant='outline'
                borderColor='rgba(255, 255, 255, 0.2)'
                color='white'
                borderRadius='lg'
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <HStack>
                  <Image
                    src='https://www.google.com/favicon.ico'
                    alt='Google'
                    w='5'
                    h='5'
                  />
                  <Text>Đăng nhập với Google</Text>
                </HStack>
              </Button>

              {/* Register Link */}
              <Text color='gray.400' fontSize='sm'>
                Chưa có tài khoản?{' '}
                <Link
                  to='/register'
                  style={{
                    color: '#60a5fa',
                    fontWeight: 600,
                  }}
                >
                  Đăng ký miễn phí
                </Link>
              </Text>
            </VStack>
          </Box>

          {/* Back to Home */}
          <Text
            color='gray.500'
            fontSize='sm'
            cursor='pointer'
            _hover={{ color: 'gray.300' }}
            onClick={() => navigate('/')}
          >
            ← Quay lại trang chủ
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default LoginPage;
