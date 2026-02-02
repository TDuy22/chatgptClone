import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LuEye, LuEyeOff, LuMail, LuLock, LuUser, LuCheck } from 'react-icons/lu';

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password strength check
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const strengthColors = ['red.400', 'orange.400', 'yellow.400', 'green.400', 'green.500'];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (!agreeTerms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }

    setIsLoading(true);
    
    // Simulate registration (replace with actual API call later)
    setTimeout(() => {
      // For now, just redirect to login
      // In the future, this will call the backend API
      setIsLoading(false);
      navigate('/login');
    }, 1500);
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
      py='10'
    >
      {/* Background Effects */}
      <Box
        position='absolute'
        top='-200px'
        right='-200px'
        w='500px'
        h='500px'
        bg='radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
        pointerEvents='none'
      />
      <Box
        position='absolute'
        bottom='-200px'
        left='-200px'
        w='500px'
        h='500px'
        bg='radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)'
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

          {/* Register Form */}
          <Box
            w='full'
            bg='rgba(255, 255, 255, 0.03)'
            border='1px solid'
            borderColor='rgba(255, 255, 255, 0.1)'
            borderRadius='2xl'
            p='8'
            backdropFilter='blur(20px)'
          >
            <VStack gap='5' as='form' onSubmit={handleRegister}>
              <VStack gap='2' textAlign='center' w='full'>
                <Heading size='lg' color='white'>
                  Tạo tài khoản
                </Heading>
                <Text color='gray.400'>
                  Bắt đầu miễn phí với Askify
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

              {/* Full Name Input */}
              <VStack w='full' align='start' gap='2'>
                <Text color='gray.300' fontSize='sm' fontWeight='medium'>
                  Họ và tên
                </Text>
                <Box position='relative' w='full'>
                  <Box
                    position='absolute'
                    left='4'
                    top='50%'
                    transform='translateY(-50%)'
                    color='gray.500'
                  >
                    <LuUser />
                  </Box>
                  <Input
                    type='text'
                    placeholder='Nguyễn Văn A'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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

              {/* Email Input */}
              <VStack w='full' align='start' gap='2'>
                <Text color='gray.300' fontSize='sm' fontWeight='medium'>
                  Email
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
                    type='email'
                    placeholder='name@company.com'
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
                <Text color='gray.300' fontSize='sm' fontWeight='medium'>
                  Mật khẩu
                </Text>
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
                    placeholder='Tối thiểu 8 ký tự'
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
                {/* Password Strength Indicator */}
                {password && (
                  <VStack w='full' gap='1' align='start'>
                    <HStack w='full' gap='1'>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Box
                          key={level}
                          flex='1'
                          h='1'
                          borderRadius='full'
                          bg={level <= passwordStrength ? strengthColors[passwordStrength - 1] : 'gray.700'}
                          transition='all 0.2s'
                        />
                      ))}
                    </HStack>
                    <Text fontSize='xs' color={strengthColors[passwordStrength - 1] || 'gray.500'}>
                      {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Nhập mật khẩu'}
                    </Text>
                  </VStack>
                )}
              </VStack>

              {/* Confirm Password Input */}
              <VStack w='full' align='start' gap='2'>
                <Text color='gray.300' fontSize='sm' fontWeight='medium'>
                  Xác nhận mật khẩu
                </Text>
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Nhập lại mật khẩu'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    pl='12'
                    pr='12'
                    h='12'
                    bg='rgba(255, 255, 255, 0.05)'
                    border='1px solid'
                    borderColor={
                      confirmPassword
                        ? confirmPassword === password
                          ? 'green.400'
                          : 'red.400'
                        : 'rgba(255, 255, 255, 0.1)'
                    }
                    borderRadius='lg'
                    color='white'
                    _placeholder={{ color: 'gray.500' }}
                    _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                    _focus={{
                      borderColor: confirmPassword === password ? 'green.400' : 'blue.400',
                      boxShadow: `0 0 0 1px ${confirmPassword === password ? 'rgba(16, 185, 129, 0.5)' : 'rgba(14, 165, 233, 0.5)'}`,
                    }}
                  />
                  <Box
                    position='absolute'
                    right='4'
                    top='50%'
                    transform='translateY(-50%)'
                    color='gray.500'
                    cursor='pointer'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    _hover={{ color: 'gray.300' }}
                  >
                    {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
                  </Box>
                </Box>
              </VStack>

              {/* Terms Checkbox */}
              <HStack w='full' align='start' gap='3'>
                <Box
                  w='5'
                  h='5'
                  borderRadius='md'
                  border='2px solid'
                  borderColor={agreeTerms ? 'blue.400' : 'rgba(255, 255, 255, 0.2)'}
                  bg={agreeTerms ? 'blue.400' : 'transparent'}
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  cursor='pointer'
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  transition='all 0.2s'
                  flexShrink={0}
                  mt='0.5'
                >
                  {agreeTerms && <LuCheck color='white' size={14} />}
                </Box>
                <Text color='gray.400' fontSize='sm'>
                  Tôi đồng ý với{' '}
                  <Text as='span' color='blue.400' cursor='pointer' _hover={{ textDecoration: 'underline' }}>
                    Điều khoản sử dụng
                  </Text>{' '}
                  và{' '}
                  <Text as='span' color='blue.400' cursor='pointer' _hover={{ textDecoration: 'underline' }}>
                    Chính sách bảo mật
                  </Text>
                </Text>
              </HStack>

              {/* Register Button */}
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
                loadingText='Đang tạo tài khoản...'
              >
                Tạo tài khoản
              </Button>

              {/* Divider */}
              <HStack w='full' gap='4'>
                <Box flex='1' h='1px' bg='rgba(255, 255, 255, 0.1)' />
                <Text color='gray.500' fontSize='sm'>hoặc</Text>
                <Box flex='1' h='1px' bg='rgba(255, 255, 255, 0.1)' />
              </HStack>

              {/* Social Register */}
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
                  <Text>Đăng ký với Google</Text>
                </HStack>
              </Button>

              {/* Login Link */}
              <Text color='gray.400' fontSize='sm'>
                Đã có tài khoản?{' '}
                <Link
                  to='/login'
                  style={{
                    color: '#60a5fa',
                    fontWeight: 600,
                  }}
                >
                  Đăng nhập
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

export default RegisterPage;
