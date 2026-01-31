import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  LuDatabase,
  LuShieldCheck,
  LuZap,
  LuFileText,
  LuMessageSquare,
  LuSearch,
  LuUsers,
  LuClock,
  LuCheck,
  LuArrowRight,
  LuPlay,
} from 'react-icons/lu';

interface LandingPageProps {
  onEnterApp: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <Box bg='gray.950' minH='100vh' color='white' overflowX='hidden'>
      {/* Navbar */}
      <Box
        position='fixed'
        top='0'
        left='0'
        right='0'
        zIndex='1000'
        bg='rgba(10, 10, 20, 0.8)'
        backdropFilter='blur(20px)'
        borderBottom='1px solid'
        borderColor='rgba(255, 255, 255, 0.1)'
      >
        <Container maxW='container.xl' py='4'>
          <HStack justify='space-between'>
            <HStack gap='3'>
              <Box
                w='40px'
                h='40px'
                bg='linear-gradient(135deg, #0ea5e9, #8b5cf6)'
                borderRadius='lg'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                <Text fontWeight='bold' fontSize='xl' color='white'>
                  A
                </Text>
              </Box>
              <Heading size='lg' bgGradient='to-r' gradientFrom='blue.400' gradientTo='purple.400' bgClip='text'>
                Askify
              </Heading>
            </HStack>
            <HStack gap='4'>
              <Button
                variant='ghost'
                color='gray.300'
                _hover={{ color: 'white', bg: 'rgba(255,255,255,0.1)' }}
                display={{ base: 'none', md: 'flex' }}
              >
                Tính năng
              </Button>
              <Button
                variant='ghost'
                color='gray.300'
                _hover={{ color: 'white', bg: 'rgba(255,255,255,0.1)' }}
                display={{ base: 'none', md: 'flex' }}
              >
                Giải pháp
              </Button>
              <Button
                variant='ghost'
                color='gray.300'
                _hover={{ color: 'white', bg: 'rgba(255,255,255,0.1)' }}
                display={{ base: 'none', md: 'flex' }}
              >
                Bảng giá
              </Button>
              <Button
                bg='linear-gradient(135deg, #0ea5e9, #8b5cf6)'
                color='white'
                px='6'
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 40px rgba(14, 165, 233, 0.4)',
                }}
                transition='all 0.3s'
                onClick={onEnterApp}
              >
                Đăng nhập
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        pt='32'
        pb='20'
        position='relative'
        overflow='hidden'
      >
        {/* Gradient Background Effects */}
        <Box
          position='absolute'
          top='-200px'
          left='-200px'
          w='600px'
          h='600px'
          bg='radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)'
          pointerEvents='none'
        />
        <Box
          position='absolute'
          top='100px'
          right='-200px'
          w='500px'
          h='500px'
          bg='radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
          pointerEvents='none'
        />

        <Container maxW='container.xl' position='relative'>
          <VStack gap='8' textAlign='center' maxW='4xl' mx='auto'>
            {/* Badge */}
            <HStack
              bg='rgba(14, 165, 233, 0.1)'
              border='1px solid'
              borderColor='rgba(14, 165, 233, 0.3)'
              borderRadius='full'
              px='4'
              py='2'
            >
              <Box w='2' h='2' bg='green.400' borderRadius='full' />
              <Text fontSize='sm' color='blue.300'>
                AI Chatbot cho doanh nghiệp
              </Text>
            </HStack>

            {/* Main Headline */}
            <Heading
              as='h1'
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight='bold'
              lineHeight='1.1'
            >
              Biến{' '}
              <Text
                as='span'
                bgGradient='to-r'
                gradientFrom='blue.400'
                gradientVia='purple.400'
                gradientTo='pink.400'
                bgClip='text'
              >
                dữ liệu doanh nghiệp
              </Text>
              <br />
              thành trợ lý AI thông minh
            </Heading>

            {/* Subheadline */}
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color='gray.400'
              maxW='2xl'
              lineHeight='1.8'
            >
              Tạo Custom GPTs từ tài liệu nội bộ với độ chính xác cao, 
              trích dẫn nguồn minh bạch và bảo mật tuyệt đối. 
              Không cần kiến thức lập trình.
            </Text>

            {/* Trust Badges */}
            <HStack gap='8' flexWrap='wrap' justify='center'>
              <HStack color='gray.400'>
                <LuCheck color='#10b981' />
                <Text fontSize='sm'>Độ chính xác cao</Text>
              </HStack>
              <HStack color='gray.400'>
                <LuShieldCheck color='#10b981' />
                <Text fontSize='sm'>Bảo mật dữ liệu</Text>
              </HStack>
              <HStack color='gray.400'>
                <LuZap color='#10b981' />
                <Text fontSize='sm'>Triển khai tức thì</Text>
              </HStack>
            </HStack>

            {/* CTA Buttons */}
            <HStack gap='4' pt='4'>
              <Button
                size='lg'
                bg='linear-gradient(135deg, #0ea5e9, #8b5cf6)'
                color='white'
                px='8'
                py='6'
                fontSize='md'
                _hover={{
                  transform: 'translateY(-3px)',
                  boxShadow: '0 20px 60px rgba(14, 165, 233, 0.4)',
                }}
                transition='all 0.3s'
                onClick={onEnterApp}
              >
                <HStack>
                  <Text>Bắt đầu miễn phí</Text>
                  <LuArrowRight />
                </HStack>
              </Button>
              <Button
                size='lg'
                variant='outline'
                borderColor='rgba(255,255,255,0.2)'
                color='white'
                px='8'
                py='6'
                fontSize='md'
                _hover={{
                  bg: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <HStack>
                  <LuPlay />
                  <Text>Xem Demo</Text>
                </HStack>
              </Button>
            </HStack>
          </VStack>

          {/* Hero Image / App Preview */}
          <Box
            mt='16'
            mx='auto'
            maxW='5xl'
            borderRadius='2xl'
            overflow='hidden'
            border='1px solid'
            borderColor='rgba(255, 255, 255, 0.1)'
            bg='rgba(255, 255, 255, 0.02)'
            boxShadow='0 40px 100px rgba(0, 0, 0, 0.5)'
          >
            <Box
              h={{ base: '250px', md: '400px', lg: '500px' }}
              bg='linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1))'
              display='flex'
              alignItems='center'
              justifyContent='center'
              position='relative'
            >
              {/* Mock Chat Interface */}
              <VStack gap='4' w='full' maxW='600px' px='6'>
                <Box
                  w='full'
                  bg='rgba(255,255,255,0.05)'
                  borderRadius='xl'
                  p='4'
                  border='1px solid'
                  borderColor='rgba(255,255,255,0.1)'
                >
                  <HStack gap='3' mb='3'>
                    <Box w='8' h='8' bg='blue.500' borderRadius='full' />
                    <Text color='gray.300' fontSize='sm'>Người dùng</Text>
                  </HStack>
                  <Text color='white'>
                    Quy trình nghỉ phép của công ty như thế nào?
                  </Text>
                </Box>
                <Box
                  w='full'
                  bg='rgba(139, 92, 246, 0.1)'
                  borderRadius='xl'
                  p='4'
                  border='1px solid'
                  borderColor='rgba(139, 92, 246, 0.2)'
                >
                  <HStack gap='3' mb='3'>
                    <Box
                      w='8'
                      h='8'
                      bg='linear-gradient(135deg, #0ea5e9, #8b5cf6)'
                      borderRadius='full'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Text fontSize='xs' fontWeight='bold'>AI</Text>
                    </Box>
                    <Text color='gray.300' fontSize='sm'>Askify</Text>
                  </HStack>
                  <Text color='white' mb='3'>
                    Theo Quy chế Nhân sự (Mục 4.2), nhân viên được nghỉ phép 12 ngày/năm...
                  </Text>
                  <HStack>
                    <Box
                      bg='rgba(16, 185, 129, 0.2)'
                      px='2'
                      py='1'
                      borderRadius='md'
                      fontSize='xs'
                      color='green.300'
                    >
                      📄 Quy_che_nhan_su.pdf - Trang 15
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py='24' bg='rgba(255, 255, 255, 0.02)'>
        <Container maxW='container.xl'>
          <VStack gap='16'>
            <VStack gap='4' textAlign='center' maxW='2xl' mx='auto'>
              <Text
                fontSize='sm'
                fontWeight='semibold'
                color='blue.400'
                textTransform='uppercase'
                letterSpacing='wider'
              >
                Tính năng nổi bật
              </Text>
              <Heading size='2xl'>
                Mọi thứ bạn cần để xây dựng{' '}
                <Text as='span' color='purple.400'>
                  AI Assistant
                </Text>
              </Heading>
              <Text color='gray.400' fontSize='lg'>
                Askify cung cấp đầy đủ công cụ để biến tài liệu doanh nghiệp thành chatbot thông minh
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap='6' w='full'>
              <FeatureCard
                icon={LuDatabase}
                title='Quản lý Collections'
                description='Tổ chức tài liệu thành các bộ sưu tập riêng biệt. Chọn đúng nguồn dữ liệu để câu trả lời chính xác hơn.'
                color='blue.400'
              />
              <FeatureCard
                icon={LuFileText}
                title='Trích dẫn Minh bạch'
                description='Không còn ảo giác AI. Mọi câu trả lời đều đi kèm trích dẫn chính xác từ tài liệu gốc để bạn đối chiếu.'
                color='green.400'
              />
              <FeatureCard
                icon={LuShieldCheck}
                title='Bảo mật Tuyệt đối'
                description='Dữ liệu của bạn là của riêng bạn. Cam kết không sử dụng dữ liệu doanh nghiệp để training mô hình.'
                color='purple.400'
              />
              <FeatureCard
                icon={LuSearch}
                title='Tìm kiếm Thông minh'
                description='Hỏi bằng ngôn ngữ tự nhiên, nhận câu trả lời chính xác từ hàng nghìn trang tài liệu trong vài giây.'
                color='orange.400'
              />
              <FeatureCard
                icon={LuMessageSquare}
                title='Giao diện Chat'
                description='Trải nghiệm chat quen thuộc như ChatGPT. Dễ sử dụng, không cần đào tạo.'
                color='pink.400'
              />
              <FeatureCard
                icon={LuZap}
                title='Triển khai Tức thì'
                description='Không cần code. Chỉ cần upload tài liệu và bắt đầu chat ngay lập tức.'
                color='yellow.400'
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* How it works Section */}
      <Box py='24'>
        <Container maxW='container.xl'>
          <VStack gap='16'>
            <VStack gap='4' textAlign='center'>
              <Text
                fontSize='sm'
                fontWeight='semibold'
                color='blue.400'
                textTransform='uppercase'
                letterSpacing='wider'
              >
                Cách hoạt động
              </Text>
              <Heading size='2xl'>
                Bắt đầu chỉ với{' '}
                <Text as='span' color='blue.400'>
                  3 bước đơn giản
                </Text>
              </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap='8' w='full'>
              <StepCard
                step='01'
                title='Upload tài liệu'
                description='Tải lên PDF, Word, hoặc bất kỳ định dạng tài liệu nào. Hệ thống tự động xử lý và phân tích nội dung.'
                icon={LuFileText}
              />
              <StepCard
                step='02'
                title='Chọn Collection'
                description='Tổ chức tài liệu theo chủ đề hoặc phòng ban. Chọn đúng nguồn dữ liệu khi đặt câu hỏi.'
                icon={LuDatabase}
              />
              <StepCard
                step='03'
                title='Bắt đầu Chat'
                description='Đặt câu hỏi bằng ngôn ngữ tự nhiên và nhận câu trả lời chính xác kèm trích dẫn nguồn.'
                icon={LuMessageSquare}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py='24' bg='rgba(255, 255, 255, 0.02)'>
        <Container maxW='container.xl'>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap='16' alignItems='center'>
            <VStack align='start' gap='6'>
              <Text
                fontSize='sm'
                fontWeight='semibold'
                color='blue.400'
                textTransform='uppercase'
                letterSpacing='wider'
              >
                Lợi ích
              </Text>
              <Heading size='2xl' lineHeight='1.2'>
                Tại sao doanh nghiệp chọn{' '}
                <Text as='span' color='purple.400'>
                  Askify?
                </Text>
              </Heading>
              <Text color='gray.400' fontSize='lg'>
                Askify giúp doanh nghiệp khai thác tối đa giá trị từ kho tài liệu nội bộ, 
                tiết kiệm thời gian và nâng cao hiệu suất làm việc.
              </Text>

              <VStack align='start' gap='4' pt='4'>
                <BenefitItem
                  icon={LuClock}
                  title='Tiết kiệm 90% thời gian'
                  description='Tìm thông tin trong vài giây thay vì lục tung hàng trăm trang tài liệu.'
                />
                <BenefitItem
                  icon={LuUsers}
                  title='Onboarding nhanh chóng'
                  description='Nhân viên mới nắm bắt quy trình công ty chỉ bằng cách hỏi-đáp.'
                />
                <BenefitItem
                  icon={LuMessageSquare}
                  title='Hỗ trợ khách hàng 24/7'
                  description='Tự động trả lời câu hỏi thường gặp dựa trên tài liệu sản phẩm.'
                />
              </VStack>
            </VStack>

            {/* Stats Card */}
            <Box
              bg='linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1))'
              borderRadius='2xl'
              p='10'
              border='1px solid'
              borderColor='rgba(255, 255, 255, 0.1)'
            >
              <SimpleGrid columns={2} gap='8'>
                <StatCard value='90%' label='Tiết kiệm thời gian tìm kiếm' />
                <StatCard value='100+' label='Định dạng file hỗ trợ' />
                <StatCard value='99.9%' label='Uptime đảm bảo' />
                <StatCard value='<3s' label='Thời gian phản hồi' />
              </SimpleGrid>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py='24'>
        <Container maxW='container.lg'>
          <Box
            bg='linear-gradient(135deg, #0ea5e9, #8b5cf6)'
            borderRadius='3xl'
            p={{ base: '8', md: '16' }}
            textAlign='center'
            position='relative'
            overflow='hidden'
          >
            {/* Background decoration */}
            <Box
              position='absolute'
              top='-50%'
              right='-20%'
              w='400px'
              h='400px'
              bg='rgba(255,255,255,0.1)'
              borderRadius='full'
              pointerEvents='none'
            />
            <Box
              position='absolute'
              bottom='-30%'
              left='-10%'
              w='300px'
              h='300px'
              bg='rgba(255,255,255,0.1)'
              borderRadius='full'
              pointerEvents='none'
            />

            <VStack gap='6' position='relative'>
              <Heading size='2xl' color='white'>
                Sẵn sàng biến dữ liệu thành sức mạnh?
              </Heading>
              <Text fontSize='xl' color='rgba(255,255,255,0.9)' maxW='xl'>
                Bắt đầu miễn phí ngay hôm nay và trải nghiệm sức mạnh của AI trong doanh nghiệp.
              </Text>
              <HStack gap='4' pt='4'>
                <Button
                  size='lg'
                  bg='white'
                  color='gray.900'
                  px='8'
                  py='6'
                  fontSize='md'
                  fontWeight='semibold'
                  _hover={{
                    transform: 'translateY(-3px)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  }}
                  transition='all 0.3s'
                  onClick={onEnterApp}
                >
                  <HStack>
                    <Text>Bắt đầu ngay</Text>
                    <LuArrowRight />
                  </HStack>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  borderColor='white'
                  color='white'
                  px='8'
                  py='6'
                  fontSize='md'
                  _hover={{
                    bg: 'rgba(255,255,255,0.2)',
                  }}
                >
                  Liên hệ tư vấn
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box py='12' borderTop='1px solid' borderColor='rgba(255, 255, 255, 0.1)'>
        <Container maxW='container.xl'>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify='space-between'
            align='center'
            gap='6'
          >
            <HStack gap='3'>
              <Box
                w='32px'
                h='32px'
                bg='linear-gradient(135deg, #0ea5e9, #8b5cf6)'
                borderRadius='lg'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                <Text fontWeight='bold' fontSize='sm' color='white'>
                  A
                </Text>
              </Box>
              <Text fontWeight='semibold' color='white'>
                Askify
              </Text>
            </HStack>

            <HStack gap='8' color='gray.400'>
              <Text
                cursor='pointer'
                _hover={{ color: 'white' }}
                transition='color 0.2s'
              >
                Về chúng tôi
              </Text>
              <Text
                cursor='pointer'
                _hover={{ color: 'white' }}
                transition='color 0.2s'
              >
                Chính sách bảo mật
              </Text>
              <Text
                cursor='pointer'
                _hover={{ color: 'white' }}
                transition='color 0.2s'
              >
                Điều khoản sử dụng
              </Text>
              <Text
                cursor='pointer'
                _hover={{ color: 'white' }}
                transition='color 0.2s'
              >
                Liên hệ
              </Text>
            </HStack>

            <Text color='gray.500' fontSize='sm'>
              © 2026 Askify. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

// Feature Card Component
function FeatureCard({
  icon: IconComponent,
  title,
  description,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Box
      bg='rgba(255, 255, 255, 0.02)'
      border='1px solid'
      borderColor='rgba(255, 255, 255, 0.08)'
      borderRadius='xl'
      p='6'
      _hover={{
        borderColor: 'rgba(255, 255, 255, 0.2)',
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      }}
      transition='all 0.3s'
      cursor='pointer'
    >
      <VStack align='start' gap='4'>
        <Flex
          w='12'
          h='12'
          bg={`rgba(${color === 'blue.400' ? '14, 165, 233' : color === 'green.400' ? '16, 185, 129' : color === 'purple.400' ? '139, 92, 246' : color === 'orange.400' ? '249, 115, 22' : color === 'pink.400' ? '236, 72, 153' : '234, 179, 8'}, 0.15)`}
          borderRadius='lg'
          align='center'
          justify='center'
        >
          <Icon as={IconComponent} boxSize='6' color={color} />
        </Flex>
        <Heading size='md' color='white'>
          {title}
        </Heading>
        <Text color='gray.400' lineHeight='1.7'>
          {description}
        </Text>
      </VStack>
    </Box>
  );
}

// Step Card Component
function StepCard({
  step,
  title,
  description,
  icon: IconComponent,
}: {
  step: string;
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <VStack
      align='center'
      gap='4'
      textAlign='center'
      p='8'
      bg='rgba(255, 255, 255, 0.02)'
      borderRadius='2xl'
      border='1px solid'
      borderColor='rgba(255, 255, 255, 0.08)'
      position='relative'
    >
      <Text
        fontSize='5xl'
        fontWeight='bold'
        bgGradient='to-r'
        gradientFrom='blue.400'
        gradientTo='purple.400'
        bgClip='text'
        opacity='0.5'
      >
        {step}
      </Text>
      <Flex
        w='16'
        h='16'
        bg='linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(139, 92, 246, 0.2))'
        borderRadius='full'
        align='center'
        justify='center'
      >
        <Icon as={IconComponent} boxSize='8' color='blue.400' />
      </Flex>
      <Heading size='md' color='white'>
        {title}
      </Heading>
      <Text color='gray.400' lineHeight='1.7'>
        {description}
      </Text>
    </VStack>
  );
}

// Benefit Item Component
function BenefitItem({
  icon: IconComponent,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <HStack align='start' gap='4'>
      <Flex
        w='10'
        h='10'
        bg='rgba(16, 185, 129, 0.15)'
        borderRadius='lg'
        align='center'
        justify='center'
        flexShrink={0}
      >
        <Icon as={IconComponent} boxSize='5' color='green.400' />
      </Flex>
      <VStack align='start' gap='1'>
        <Text fontWeight='semibold' color='white'>
          {title}
        </Text>
        <Text color='gray.400' fontSize='sm'>
          {description}
        </Text>
      </VStack>
    </HStack>
  );
}

// Stat Card Component
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <VStack align='center' gap='2'>
      <Text
        fontSize='4xl'
        fontWeight='bold'
        bgGradient='to-r'
        gradientFrom='blue.400'
        gradientTo='purple.400'
        bgClip='text'
      >
        {value}
      </Text>
      <Text color='gray.400' fontSize='sm' textAlign='center'>
        {label}
      </Text>
    </VStack>
  );
}

export default LandingPage;
