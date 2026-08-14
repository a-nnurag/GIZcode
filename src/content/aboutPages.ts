export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'term'; name: string; unit?: string; description: string }
  | { type: 'image'; src: string; caption: string };

export interface AboutPageContent {
  slug: string;
  title: string;
  blocks: ContentBlock[];
}

export const ABOUT_PAGES: AboutPageContent[] = [
  {
    slug: 'about-atlas',
    title: 'About Atlas',
    blocks: [
      {
        type: 'paragraph',
        text: 'Uttarakhand Vulnerability Atlas has been established to provide improved data, intelligence and expert advice on climate risks and impacts to support and inform decision-making.',
      },
      {
        type: 'paragraph',
        text: 'In an age of information and uncertainty, it is difficult to determine where we get the most accurate information to inform the decisions we make. We know integrated, accurate, timely and accessible information and expert advice enables people to make smarter and more proactive decisions, decisions that reduce impacts and risks. Better intel is needed to enable governments, industries and communities to prepare for, respond to, and recover from extreme weather events.',
      },
      { type: 'heading', text: 'Why Uttarakhand Vulnerability Atlas is needed' },
      {
        type: 'paragraph',
        text: 'Uttarakhand’s climate is changing. This means there is a greater risk of climate induced extremes and disasters.',
      },
      {
        type: 'paragraph',
        text: 'Climate change is altering the nature, intensity and spatial distribution of hazards affecting Uttarakhand.',
      },
      { type: 'paragraph', text: 'These extremes have the potential to impact our:' },
      {
        type: 'list',
        items: [
          'health and wellbeing',
          'agriculture',
          'livelihoods',
          'critical infrastructure: roads',
          'economy',
          'energy supplies',
          'forest and biodiversity',
        ],
      },
      {
        type: 'paragraph',
        text: 'Climate dataset and assessments shows that climate extremes is expected to behave differently compared to events of the past. Preparing for and adapting to these changes is vital.',
      },
      {
        type: 'paragraph',
        text: 'If we are to survive and thrive with a changing and more challenging climate, Uttarakhand must manage and invest in adapting and reducing to climate risks and impacts and take advantage of any opportunities as they arise. Preparing for and reducing the risk of natural disasters and taking action can protect individuals, communities and our environment.',
      },
      { type: 'paragraph', text: 'This means we need better information, understanding and skills to prepare for these changes.' },
      { type: 'heading', text: 'The Role of Uttarakhand Vulnerability Atlas' },
      {
        type: 'paragraph',
        text: 'Our project developed an understanding of how climate risks occur and change through time, how they affect Uttarakhand social, environmental, physical, institutional, economic and psychological, and where our people, systems and critical infrastructure are most vulnerable.',
      },
      { type: 'paragraph', text: 'We support both disaster management and climate adaptation by:' },
      {
        type: 'list',
        items: [
          'supporting operational readiness and response for climate-induced hazards within Uttarakhand',
          'shaping and informing natural disaster risk reduction, prevention and medium to longer term climate adaptation action.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Uttarakhand Vulnerability Atlas intend is building capability needed to provide quality data, intelligence and insights to support short, medium and long-term decision-making for the Uttarakhand. We are developing a structured approach, methods and processes required to integrate and synthesise information across departments.',
      },
      { type: 'paragraph', text: 'The capability this Atlas is developing aims to provide advanced information and knowledge on:' },
      {
        type: 'list',
        items: [
          'how the climate is changing (at various scales from scale down to block) and the implications of these changes',
          'when and where natural hazards are likely to occur now and, in the future,',
          'what the impact would be with appropriate investments',
          'what the impact could be if we do nothing',
          'what support is needed to cost-effectively reduce exposure and vulnerability',
          'how vulnerable those communities and businesses are to climate challenges and natural hazards',
          'what communities and businesses are likely to be affected',
          'the likelihood, frequency and intensity of these events, combined with the effects of a changing climate.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Therefore, Uttarakhand Vulnerability Atlas is being developed as a state digital platform to strengthen Uttarakhand’s ability to understand, anticipate and respond to the risks arising from climate change and climate-induced hazards. We need to leverage effort and boost our understanding of where Uttarakhand is vulnerable to climate change and increasingly complex extreme climate induced hazards. This is multifaceted and has many layers. It requires building and enhancing an ongoing capability that supports planning, response, reducing the risk of disasters, mitigation and adaptation.',
      },
      { type: 'heading', text: 'Statement of Intent' },
      {
        type: 'paragraph',
        text: 'Uttarakhand, being highly climate-sensitive Himalayan state with rapidly changing climatic conditions interacting with complex terrain, fragile ecosystems, dispersed settlements and infrastructure, and livelihoods that are closely dependent on natural resources.',
      },
      {
        type: 'paragraph',
        text: 'Increasing temperatures, changing precipitation patterns and intensification of climate extremes are altering the frequency, intensity and spatial distribution of hazards such as floods, droughts, landslides, heat stress, glacial lake outburst floods (GLOFs), forest fires and other climate-induced risks.',
      },
      {
        type: 'paragraph',
        text: 'These risks do not occur in isolation. Climate hazards increasingly interact with existing vulnerabilities across social, economic, environmental, physical, infrastructural, psychological dimensions creating cascading impacts across agriculture, forests and biodiversity, water resources, water supply and sanitation, health, energy, roads and linear infrastructure and tourism.',
      },
      {
        type: 'paragraph',
        text: 'Our intent is therefore to develop a scientifically robust, spatially explicit and decision-oriented assessment of climate vulnerabilities of Uttarakhand that enables the State and its stakeholders to understand not only where climate hazards may occur, but also who and what is exposed, why they are vulnerable, what impacts may result, and where adaptation action should be prioritised.',
      },
      {
        type: 'paragraph',
        text: 'The assessment will translate climate data and infrastructural data into vulnerability information into usable intelligence for planning, investment and climate-resilient development.',
      },
    ],
  },
  {
    slug: 'climate-scenario',
    title: 'Climate Scenario',
    blocks: [
      {
        type: 'paragraph',
        text: 'Climate scenarios are representations of how the climate may change in the future under different assumptions about greenhouse gas emissions, socioeconomic development and land-use change. They do not represent predictions of a single future, but provide a range of plausible future climate conditions that can be used to assess how climate-related hazards and impacts may evolve.',
      },
      {
        type: 'paragraph',
        text: 'For the Uttarakhand assessment, future climate conditions are examined using the Shared Socioeconomic Pathways (SSPs) adopted in the IPCC Sixth Assessment Report. The assessment considers two contrasting scenarios:',
      },
      {
        type: 'list',
        items: [
          'SSP1-2.6: an intermediate emissions scenario representing a future in which socioeconomic trends broadly follow historical patterns, with some progress towards sustainability and climate mitigation, but without achieving very low emissions.',
          'SSP5-8.5: a very high greenhouse gas emissions scenario representing a future with high energy demand and continued reliance on fossil fuels, resulting in substantially greater radiative forcing and climate change.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Using both scenarios allows the assessment to examine how the magnitude and spatial distribution of climate change and associated hazards may differ under moderate and very high emissions pathways.',
      },
      { type: 'heading', text: 'Why use SSP1-2.6 and SSP5-8.5?' },
      {
        type: 'paragraph',
        text: 'Climate projections contain uncertainty arising from both the future emissions pathway and differences between climate models. Assessing more than one scenario helps capture a range of plausible future conditions and allows the robustness of projected changes to be examined.',
      },
      {
        type: 'paragraph',
        text: 'For Uttarakhand, this is particularly important because changes in temperature and precipitation can have consequences across water resources, agriculture and horticulture, forests and biodiversity, energy, roads and critical infrastructure, health and tourism.',
      },
      {
        type: 'paragraph',
        text: 'The use of contrasting scenarios therefore enables the assessment to consider not only how climate may change, but also how the magnitude of potential sectoral impacts may differ under different future pathways.',
      },
      { type: 'heading', text: 'Future Climate Projection Periods' },
      { type: 'paragraph', text: 'The Uttarakhand assessment considers two future time horizons:' },
      { type: 'subheading', text: '2041–2070: Mid-Century' },
      {
        type: 'paragraph',
        text: 'This period represents the near-to-mid-century future and is particularly relevant for understanding climate risks that may emerge within current and near-term planning horizons.',
      },
      { type: 'paragraph', text: 'This period can support assessment of:' },
      {
        type: 'list',
        items: [
          'changes in temperature and precipitation',
          'changes in warm days and warm nights',
          'changes in extreme rainfall',
          'changes in consecutive dry days',
          'emerging drought and flood conditions',
          'near-to-mid-term implications for climate-sensitive sectors and infrastructure',
        ],
      },
      { type: 'subheading', text: '2071–2100: End-Century Period' },
      {
        type: 'paragraph',
        text: 'The 2071–2100 period represents the end-century future and provides an indication of the potential magnitude of climate change under different emissions pathways over the longer term.',
      },
      { type: 'paragraph', text: 'This period is particularly relevant for assessing:' },
      {
        type: 'list',
        items: [
          'longer-term changes in temperature',
          'changes in precipitation regimes',
          'intensification or alteration of climate extremes',
          'persistent changes in drought and extreme rainfall characteristics',
          'long-term implications for ecosystems and biodiversity',
          'climate risks to infrastructure and development systems with long design and operating lives',
        ],
      },
      { type: 'heading', text: 'Global Warming Levels and Uttarakhand' },
      {
        type: 'paragraph',
        text: 'GWLs are used in climate projections to describe the expected climate changes that we will experience when global average temperatures reach particular degrees of warming compared to the pre-industrial era. Depending on emissions levels (described by Shared Socio-economic Pathways, SSPs), these levels of warming will be reached at different time periods. Advantages of using the Global Warming Levels are that they are informative and easy to understand, are recognised internationally (e.g. referenced in the Paris Agreement) and are highly policy relevant. GWLs also have the advantage of standardising across different contexts, so results presented for GWLs are comparable when using different future pathways (e.g. SSP and RCP) or models (e.g. CMIP5 and CMIP6).',
      },
      {
        type: 'image',
        src: '/about/climate-scenario-warming-levels.png',
        caption: 'Global mean temperature change relative to 1850–1900 under low (SSP1-2.6) and high (SSP3-7.0) emissions scenarios.',
      },
      { type: 'subheading', text: 'Global Warming Levels and time periods' },
      {
        type: 'paragraph',
        text: '1.2°C is the current level of global warming for the 20-year period centred around 2020. Analysing this level allows us to compare future warming scenarios with our current climate.',
      },
      {
        type: 'paragraph',
        text: '1.5°C will be reached in the near-term period under all emissions scenarios. Global average temperatures will only stabilise around 1.5°C under extremely low emissions scenarios (SSP1-1.9) and with some ‘overshoot’ (that is, if emissions are very low, warming is expected to temporarily exceed 1.5°C before stabilising at or below 1.5°C).',
      },
      {
        type: 'paragraph',
        text: '2.0°C will be reached around mid-century under moderate, high or very high emissions scenarios. Under low emissions, global average temperatures are likely to stabilise at or just under 2.0°C. Under extremely low emissions scenarios (SSP1-1.9), this level could be avoided altogether.',
      },
      {
        type: 'paragraph',
        text: '2.7°C will be reached at the end of the century under current policy (and without further concerted action). This level will not be assessed on the maps and is included only for context as an indication of our current trajectory.',
      },
      {
        type: 'paragraph',
        text: '3.0°C will possibly be reached after 2050 under moderate emissions scenarios. It is very likely that this level will be reached after 2050 under high to very high emissions scenarios.',
      },
      {
        type: 'paragraph',
        text: 'GWLs are different from local temperature changes. A 1.5°C global warming level does not mean that Uttarakhand itself will experience only 1.5°C of warming. Land areas, including mountainous regions, can experience warming that differs from the global land–ocean average.',
      },
      {
        type: 'paragraph',
        text: 'GWLs are useful because they provide a common reference point for comparing climate impacts across regions and models. However, for this assessment, the primary analytical framework is based on SSP2-4.5 and SSP5-8.5 scenario projections for defined time periods, rather than assigning Uttarakhand-specific impacts to individual GWL thresholds.',
      },
      { type: 'paragraph', text: 'The relationship can therefore be understood as:' },
      {
        type: 'paragraph',
        text: 'Global Emissions Pathway → Global Climate Response → Regional Climate Response → Uttarakhand Climate Projections → Hazard Changes → Sectoral Impacts',
      },
      { type: 'heading', text: 'How the scenarios are used in this assessment' },
      {
        type: 'paragraph',
        text: 'The climate projections are not interpreted as deterministic forecasts. Instead, they provide a basis for assessing plausible changes in the climatic conditions that influence hazard and sectoral impacts in Uttarakhand.',
      },
      { type: 'paragraph', text: 'For each climate indicator, the assessment examines changes in:' },
      {
        type: 'list',
        items: [
          'Average Temperature',
          'Tmax',
          'Tmin',
          'TX90p – Warm Days',
          'TN90p – Warm Nights',
          'Annual Precipitation',
          'Rainfall Variability',
          'RX1day – Maximum 1-Day Rainfall',
          'Consecutive Dry Days (CDD)',
        ],
      },
      {
        type: 'paragraph',
        text: 'These indicators are then considered in relation to the major hazards assessed for Uttarakhand, including fluvial floods, drought, landslides, GLOF-related hazards and extreme heat.',
      },
    ],
  },
  {
    slug: 'risk-understanding',
    title: 'Risk_Understanding',
    blocks: [
      {
        type: 'paragraph',
        text: 'Climate assessment shows that the weather is expected to behave differently in the future compared to the past. There will be seasonal changes, spatial change, and the hazards themselves may have different characteristics and could impact Uttarakhand at different times or even at the same time.',
      },
      { type: 'heading', text: 'Understanding climate risks' },
      {
        type: 'paragraph',
        text: 'Understanding the risks associated with changing climate patterns, climate induced hazards and their potential impacts, can enable us to make better decisions to prepare for and adapt to climate change. The changing climate may also present opportunities for Uttarakhand to pursue adaptation measures that deliver multiple benefits. These include restoring and conserving forests, springs, wetlands and mountain catchments, which can reduce risks from floods, landslides, drought and water stress while also supporting biodiversity, improving water security, strengthening livelihoods and enhancing carbon sequestration.',
      },
      {
        type: 'paragraph',
        text: 'When events such as forest fire, landslide or floods, the human, environmental, and economic impacts can be significant. Climate risk is the potential for harmful consequences to human, economic and ecological systems from climate hazards.',
      },
      { type: 'paragraph', text: 'Climate risk can arise from:' },
      {
        type: 'list',
        items: [
          'changes in our climate and natural hazards',
          'how people or systems may be exposed to those hazards',
          'how people or systems may be vulnerable to the risks.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Climate risks can affect human lives, health and wellbeing, economic, social and cultural assets and investments, infrastructure, service provision, and the natural domain: ecosystems (including ecosystem services) and species.',
      },
      { type: 'paragraph', text: 'Climate risk can be reduced if we take actions to adapt to risks.' },
      { type: 'heading', text: 'How we understand climate risks' },
      {
        type: 'paragraph',
        text: 'Climate risk is determined by a combination of hazards, exposures, vulnerabilities and responses.',
      },
      {
        type: 'paragraph',
        text: 'Hazards are the potential occurrence of an events or trend that may cause health impacts and damage to property, infrastructure, livelihoods, services, ecosystems, and environmental resources.',
      },
      {
        type: 'paragraph',
        text: 'Exposure is the presence of things that could be adversely affected by climate and weather-related hazards. These include people, ecosystems, services, resources, infrastructure, or economic, social, and/or cultural assets.',
      },
      {
        type: 'paragraph',
        text: 'Vulnerability is the propensity or predisposition to be adversely affected. It encompasses a variety of concepts and elements, including sensitivity to harm and the capacity to cope and adapt.',
      },
      {
        type: 'paragraph',
        text: 'Response refers to how actions to address climate risks might not work as planned or could create other problems.',
      },
      { type: 'paragraph', text: 'Our Project defines these key terms that we use to determine climate impacts and consequences.' },
      {
        type: 'list',
        items: [
          'Impacts: the consequences of realised risks on natural and human systems. Impacts may be referred to as consequences or outcomes and can be adverse or beneficial.',
          'Cascading impacts/consequences: Cascading impacts from extreme weather/climate events occur when an extreme hazard generates a sequence of secondary events in natural and human systems that result in additional physical, natural, social or economic disruption. Cascading impacts are complex and multi-dimensional and are generally associated with ways vulnerability is increased.',
        ],
      },
      {
        type: 'paragraph',
        text: 'In considering who or what may be at risk from climate related hazards, decision-makers consider information across a range of environments. U-DVRI provides integrated data, intelligence and expert advice on climate risks and impacts to support and inform decision-making.',
      },
    ],
  },
  {
    slug: 'our-project',
    title: 'Our project',
    blocks: [
      {
        type: 'subheading',
        text: 'Developing Vulnerability Assessment for Climate-Induced Hazards for Uttarakhand, India',
      },
      {
        type: 'paragraph',
        text: 'The project establishes a consistent analytical framework for assessing climate-induced hazards and their implications across Uttarakhand.',
      },
      {
        type: 'paragraph',
        text: 'A key foundation is the downscaled climate projections, enabling assessment of future climate conditions at an appropriate spatial scale. The analysis will consider both SSP2-4.5 and SSP5-8.5 scenarios and examine projected conditions for 2021–2050 and 2071–2100.',
      },
      {
        type: 'paragraph',
        text: 'This forward-looking evidence will be combined with historical climate information, hazard datasets, demographic and socioeconomic characteristics, environmental conditions, infrastructure and sectoral information to develop a comprehensive understanding of climate risk. This approach will ensure that the assessment moves beyond isolated hazard mapping towards an integrated understanding of climate risk.',
      },
      {
        type: 'paragraph',
        text: "The assessment will examine climate risks across priority sectors that are fundamental to Uttarakhand's development and resilience:",
      },
      {
        type: 'list',
        items: [
          'Agriculture and livelihoods',
          'Forests and biodiversity',
          'Water resources',
          'Water supply and sanitation',
          'Health',
          'Energy',
          'Roads and linear infrastructure',
          'Tourism',
        ],
      },
      {
        type: 'paragraph',
        text: 'For each sector, the assessment will examine the interaction between hazard, exposure, sensitivity and adaptive capacity, recognising that the same climatic hazard can produce very different consequences depending on the characteristics of people, ecosystems, infrastructure and local economies.',
      },
      {
        type: 'paragraph',
        text: 'Particular attention will be given to vulnerable demographic groups, including women, children and marginalised communities, and to spatial variations in vulnerability between districts, blocks, settlements and ecological zones.',
      },
      {
        type: 'paragraph',
        text: 'The assessment will also consider the potential for cascading and interconnected impacts, recognising that disruption in one sector can amplify risks in others — for example, extreme rainfall affecting roads and connectivity, which in turn disrupts access to health services, markets, tourism and essential supplies.',
      },
      { type: 'heading', text: 'From Hazard Maps to Climate Risk' },
      { type: 'paragraph', text: 'The project will adopt a risk-based rather than hazard-only approach.' },
      {
        type: 'paragraph',
        text: 'Hazard information will be spatially integrated with exposure and vulnerability layers to identify areas where climate change could result in significant impacts on people, ecosystems, livelihoods and critical infrastructure.',
      },
      { type: 'paragraph', text: 'The assessment will seek to answer practical questions for decision-makers:' },
      {
        type: 'list',
        items: [
          'Where are climate hazards projected to intensify?',
          'Which populations and settlements are most exposed?',
          'Which sectors and assets are most sensitive?',
          'Which communities have limited adaptive capacity?',
          'Where are multiple climate risks likely to converge?',
          'Which infrastructure and services are most likely to experience functional disruption?',
          'Which locations should receive priority for adaptation investment?',
          'What adaptation measures are most appropriate for different risk contexts?',
        ],
      },
      {
        type: 'paragraph',
        text: 'This will enable the project to move from “where is the hazard?” to “what is at risk, why is it at risk, and what can be done?”',
      },
      { type: 'heading', text: 'Building a Common Language of Climate Risk' },
      {
        type: 'paragraph',
        text: 'A key intention of the project is to establish a common and scientifically consistent understanding of climate risk across Uttarakhand.',
      },
      {
        type: 'paragraph',
        text: 'Different departments often hold valuable datasets and sector-specific assessments, but these may differ in spatial scale, methodology and terminology. The project will seek to bring these information streams together through a common analytical framework.',
      },
      { type: 'paragraph', text: 'This will help establish a shared understanding of:' },
      {
        type: 'paragraph',
        text: 'Climate Profiling → Hazard → Exposure → Impact → Vulnerability → Risk → Adaptation',
      },
      {
        type: 'paragraph',
        text: 'Such consistency will facilitate cross-sectoral planning and reduce fragmentation in climate-risk assessment.',
      },
    ],
  },
];
